pipeline {
    agent any
    environment {
        DOCKER_IMAGE = "saiffulllah/framerate-store:latest"
        // Ensure this matches your actual test repo URL
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
                    sh 'cp $ENV_FILE .env'
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
                    // Deploy the app on port 3001 so it's live for the tests
                    sh 'docker-compose -f docker-compose.jenkins.yml down || true'
                    sh 'docker-compose -f docker-compose.jenkins.yml up -d'
                    
                    // Give Next.js 15 seconds to fully boot before hammering it with tests
                    sleep time: 15, unit: 'SECONDS'
                }
            }
        }
        stage('Fetch & Run Selenium Tests') {
            steps {
                script {
                    // Isolate the test environment from the app source code
                    dir('test-automation') {
                        git branch: 'main', url: "${TEST_REPO_URL}"
                        
                        // Build the isolated Python/Selenium container
                        sh "docker build -t framerate-tester ."
                        
                        // Ensure host directory exists for the volume mount
                        sh "mkdir -p results" 
                        
                        // Run tests. Mount the 'results' folder to extract the XML file back to Jenkins
                        sh """
                        docker run --rm \
                        --network="host" \
                        -v \$(pwd)/results:/app/results \
                        framerate-tester
                        """
                    }
                }
            }
        }
    }
    post {
        always {
            script {
                // Parse the XML so Jenkins builds a test trend graph
                junit 'test-automation/results/test-results.xml'
                
                // Extract the exact email address of the person who made the commit
                def COMMITTER_EMAIL = sh(script: "git log -1 --pretty=%ae", returnStdout: true).trim()
                def COMMIT_MSG = sh(script: "git log -1 --pretty=%s", returnStdout: true).trim()
                
                // Send the email ONLY to the committer
                emailext (
                    to: "${COMMITTER_EMAIL}",
                    subject: "Jenkins Build ${currentBuild.currentResult}: Framerate Store CI/CD",
                    body: """
                    <h2>Build Status: ${currentBuild.currentResult}</h2>
                    <p><b>Triggered by commit:</b> ${COMMIT_MSG}</p>
                    <p>Check the Jenkins console output and Selenium Test Results at: <br>
                    <a href="${env.BUILD_URL}">${env.BUILD_URL}</a></p>
                    """,
                    mimeType: 'text/html'
                )
            }
        }
        success {
            echo 'Build, Deployment, and Testing completely successful!'
        }
        failure {
            echo 'Pipeline failed. Check logs and emailed reports.'
        }
    }
}