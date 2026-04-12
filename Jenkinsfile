pipeline {
    agent any
    environment {
        DOCKER_IMAGE = "saiffulllah/framerate-store:latest"
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
        stage('Run with Docker Compose') {
            steps {
                script {
                    sh 'docker-compose -f docker-compose.jenkins.yml down || true'
                    sh 'docker-compose -f docker-compose.jenkins.yml up -d'
                }
            }
        }
    }
    post {
        success {
            echo 'Build and deployment successful!'
        }
        failure {
            echo 'Build failed. Check logs above.'
        }
    }
}