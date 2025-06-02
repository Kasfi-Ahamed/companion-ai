pipeline {
  agent any

  environment {
    MONGO_URI = "mongodb://mongo:27017/companion-ai"
    NODE_ENV = 'test'
  }

  tools {
    nodejs 'NodeJS' // Ensure you have a NodeJS tool in Jenkins global tools config
    // Optional: you may define this in global tools if you need node/npm toolchain
  }

  stages {

    stage('Checkout SCM') {
      steps {
        checkout scm
      }
    }

    stage('Build') {
      steps {
        dir('backend') {
          bat 'npm install'
        }
      }
    }

    stage('Test') {
      steps {
        dir('backend') {
          bat 'docker-compose down -v || exit 0'
          bat 'docker-compose up -d'
          bat 'timeout /T 20'
          bat 'npm run test -- --coverage'
        }
      }
    }

    stage('Security') {
      steps {
        dir('backend') {
          bat '''
            echo Running npm audit...
            npm audit --json > audit-report.json || exit 0
          '''
        }
      }
    }

    stage('Code Quality') {
      steps {
        withSonarQubeEnv('LocalSonarQube') {
          dir('backend') {
            bat 'sonar-scanner.bat -Dsonar.projectKey=companion-ai -Dsonar.sources=./ -Dsonar.javascript.lcov.reportPaths=coverage/lcov.info'
          }
        }
      }
    }

    stage('Deployment') {
      steps {
        echo "✅ Deployment logic would go here. Skipped for now."
      }
    }

    stage('Release') {
      steps {
        echo "📦 Tagging and releasing skipped in local pipeline."
      }
    }

    stage('Monitoring') {
      steps {
        echo "📈 Prometheus/Grafana monitoring (handled externally)."
      }
    }

    stage('Quality Gate') {
      steps {
        timeout(time: 1, unit: 'MINUTES') {
          waitForQualityGate abortPipeline: true
        }
      }
    }
  }

  post {
    always {
      echo "🧹 Cleaning up..."
      dir('backend') {
        bat 'docker-compose down -v || exit 0'
      }
    }

    success {
      echo '✅ Pipeline completed successfully!'
    }

    failure {
      echo '❌ Pipeline failed. Check logs for details.'
    }
  }
}
