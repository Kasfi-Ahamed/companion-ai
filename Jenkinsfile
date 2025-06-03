pipeline {
  agent any

  environment {
    SONAR_SCANNER_HOME = tool 'SonarScanner'
    NODE_HOME = tool name: 'NodeJS', type: 'jenkins.plugins.nodejs.tools.NodeJSInstallation'
    PATH = "${NODE_HOME}/bin:${env.PATH}"
  }

  stages {
    stage('Checkout SCM') {
      steps {
        checkout([$class: 'GitSCM',
          branches: [[name: '*/main']],
          userRemoteConfigs: [[
            url: 'https://github.com/Kasfi-Ahamed/companion-ai.git',
            credentialsId: 'github-creds'
          ]]
        ])
      }
    }

    stage('Install Dependencies') {
      steps {
        dir('backend') {
          bat 'npm install'
        }
      }
    }

    stage('Run Tests') {
      steps {
        dir('backend') {
          bat 'cross-env NODE_ENV=test jest --coverage --coverageReporters=lcov --config=jest.config.js'
        }
      }
    }

    stage('Security') {
      steps {
        dir('backend') {
          bat 'npm audit --json > audit-report.json || exit 0'
          echo 'Security audit completed. Check audit-report.json.'
        }
      }
    }

    stage('Code Quality') {
      steps {
        dir('backend') {
          withSonarQubeEnv('SonarQube') {
            bat "${env.SONAR_SCANNER_HOME}/bin/sonar-scanner -Dsonar.projectKey=companion-ai -Dsonar.sources=. -Dsonar.javascript.lcov.reportPaths=coverage/lcov.info"
          }
        }
      }
    }

    stage('Quality Gate') {
      steps {
        timeout(time: 1, unit: 'MINUTES') {
          waitForQualityGate abortPipeline: true
        }
      }
    }

    stage('Post Actions') {
      steps {
        echo 'Pipeline completed successfully.'
      }
    }
  }

  post {
    failure {
      echo 'Pipeline failed.'
    }
  }
}
