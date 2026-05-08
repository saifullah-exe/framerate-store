pipeline {
    agent any
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
                    // Using -f to force overwrite, just to be safe
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
                    sh 'docker-compose -f docker-compose.jenkins.yml down || true'
                    sh 'docker-compose -f docker-compose.jenkins.yml up -d'
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
                // THE FIX: allowEmptyResults prevents fatal crashes if tests never run
                junit testResults: 'test-automation/results/test-results.xml', allowEmptyResults: true
                
                def COMMITTER_EMAIL = sh(script: "git log -1 --pretty=%ae", returnStdout: true).trim()
                def COMMIT_MSG = sh(script: "git log -1 --pretty=%s", returnStdout: true).trim()
                
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