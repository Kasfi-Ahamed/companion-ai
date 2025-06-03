pipeline {
    agent any

    environment {
        NODE_ENV = 'test'
        MONGO_URL = 'mongodb://localhost:27017/testdb'
        SONAR_HOST_URL = 'http://localhost:9000'
        SONAR_TOKEN = credentials('sqa_5f2cb32a14f953a5753be138a07f83245148a930') // Replace with your actual credentials ID
    }

    stages {
        stage('Install Dependencies') {
            steps {
                dir('backend') {
                    sh 'npm install'
                }
            }
        }

        stage('Run Tests') {
            steps {
                dir('backend') {
                    sh 'npm test'
                }
            }
        }

        stage('Code Quality Analysis') {
            steps {
                dir('backend') {
                    sh '''
                        sonar-scanner \
                        -Dsonar.projectKey=companion-ai \
                        -Dsonar.sources=. \
                        -Dsonar.host.url=$SONAR_HOST_URL \
                        -Dsonar.login=$SONAR_TOKEN
                    '''
                }
            }
        }
    }
}
