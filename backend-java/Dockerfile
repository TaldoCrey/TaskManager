# ---- Estágio 1: Build (Compilação) ----
# Usamos uma imagem do Maven (que tem o Java JDK) para compilar o projeto
FROM maven:3.8.5-openjdk-17 AS build

# Define o diretório de trabalho dentro do container
WORKDIR /app

# Copia os arquivos de configuração e o código-fonte
COPY pom.xml .
COPY src ./src

# Roda o comando do Maven para compilar e criar o .jar
# -DskipTests pula os testes unitários (mais rápido para deploy)
RUN mvn package -DskipTests

# ---- Estágio 2: Run (Execução) ----
# Agora usamos uma imagem "limpa" e leve, só com o Java (JRE) para rodar
FROM eclipse-temurin:17-jre-alpine

WORKDIR /app

# Copia o .jar que foi criado no estágio 'build' para este novo container
COPY --from=build /app/target/*.jar app.jar

# Expõe a porta que o Spring Boot usa (8080 por padrão)
EXPOSE 8080

# O comando que o Render vai usar para iniciar sua API
ENTRYPOINT ["java", "-jar", "app.jar"]