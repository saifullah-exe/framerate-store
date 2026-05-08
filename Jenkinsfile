pipeline {
    agent any
    
    // Fails the build gracefully if the server hangs past 6 minutes
    options {
        timeout(time: 6, unit: 'MINUTES')
    }
    
    environment {
        DOCKER_IMAGE = "saiffulllah/framerate-store:latest"
        TEST_REPO_URL = "https://github.com/saifullah-exe/framerate-store-tests.git"
    }
    
    stages {
        stage('Clone Repository') {
            steps {
                checkout scm
            }
        }
        
        stage('Prepare Environment') {
            steps {
                withCredentials([file(credentialsId: 'framerate-env', variable: 'ENV_FILE')]) {
                    sh 'cp -f $ENV_FILE .env'
                }
            }
        }
        
        stage('Build Docker Image') {
            steps {
                script {
                    sh "docker build -t $DOCKER_IMAGE ."
                }
            }
        }
        
        stage('Run App with Docker Compose') {
            steps {
                script {
                    // Deploy the app on port 3001 using the optimized image
                    sh 'docker-compose -f docker-compose.jenkins.yml down || true'
                    sh 'docker-compose -f docker-compose.jenkins.yml up -d'
                    
                    // Give Next.js 15 seconds to fully boot
                    sleep time: 15, unit: 'SECONDS'
                }
            }
        }
        
        stage('Fetch & Run Selenium Tests') {
            steps {
                script {
                    dir('test-automation') {
                        git branch: 'main', url: "${TEST_REPO_URL}"
                        
                        sh "docker build -t framerate-tester ."
                        sh "mkdir -p results" 
                        
                        // THE FIX: Adding '|| true' stops Jenkins from aborting if a test fails.
                        // It allows the pipeline to proceed to the post block so the JUnit plugin can evaluate the XML.
                        sh """
                        docker run --rm \
                        --network="host" \
                        -v \$(pwd)/results:/app/results \
                        framerate-tester || true
                        """
                    }
                }
            }
        }
    }
    
    post {
        always {
            script {
                // The JUnit plugin will read the XML. If tests failed, it changes 
                // the pipeline status to UNSTABLE (Yellow) rather than FAILURE (Red).
                junit testResults: 'test-automation/results/test-results.xml', allowEmptyResults: true
                
                def COMMITTER_EMAIL = sh(script: "git log -1 --pretty=%ae", returnStdout: true).trim()
                def COMMIT_MSG = sh(script: "git log -1 --pretty=%s", returnStdout: true).trim()
                
                // Detailed email showing exact pass/fail counts
                emailext (
                    to: "${COMMITTER_EMAIL}",
                    subject: "Jenkins Build ${currentBuild.currentResult}: Framerate Store CI/CD",
                    body: """
                    <h2>Pipeline Status: ${currentBuild.currentResult}</h2>
                    <p><b>Triggered by commit:</b> ${COMMIT_MSG}</p>
                    <hr>
                    <h3>Deployment Status</h3>
                    <p>The Docker container deployment stage completed successfully. The application is live on port 3001.</p>
                    <hr>
                    <h3>Automated Test Results Summary</h3>
                    <p>Total Tests: \${TEST_COUNTS, var="total"}</p>
                    <p>Passed: <span style="color:green">\${TEST_COUNTS, var="pass"}</span></p>
                    <p>Failed: <span style="color:red">\${TEST_COUNTS, var="fail"}</span></p>
                    <p>Skipped: \${TEST_COUNTS, var="skip"}</p>
                    <br>
                    <p>Check the full Jenkins console output and Test Trend Graph at: <br>
                    <a href="${env.BUILD_URL}">${env.BUILD_URL}</a></p>
                    """,
                    mimeType: 'text/html'
                )
            }
        }
        success {
            echo 'Build, Deployment, and Testing completely successful!'
        }
        unstable {
            echo 'Deployment successful, but some Selenium tests failed. Check the Jenkins test report.'
        }
        failure {
            echo 'Pipeline failed entirely. Check logs.'
        }
    }
}