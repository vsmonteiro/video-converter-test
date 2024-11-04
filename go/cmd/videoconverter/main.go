package main

import (
	"database/sql"
	"fmt"
	"log/slog"
	"os"
	"video-converter/internal/converter"
	"video-converter/internal/rabbitmq"

	_ "github.com/lib/pq"
	"github.com/streadway/amqp"
)

func connectDb() (*sql.DB, error) {
	user := getEnvOrDefault("POSTGRES_USER", "user")
	password := getEnvOrDefault("POSTGRES_PASSWORD", "root")
	dbName := getEnvOrDefault("POSTGRES_DB", "converter")
	host := getEnvOrDefault("POSTGRES_HOST", "db")
	sslMode := getEnvOrDefault("POSTGRES_SSLMODE", "disable")

	connStr := fmt.Sprintf("user=%s password=%s dbname=%s host=%s sslmode=%s", user, password, dbName, host, sslMode)
	db, err := sql.Open("postgres", connStr)

	if err != nil {
		slog.Error("Error connecting to DB", slog.String("connStr", connStr))
		return nil, err
	}

	err = db.Ping()
	if err != nil {
		slog.Error("Error pinging DB", slog.String("connStr", connStr))
		return nil, err
	}

	slog.Info("Connected to DB successfully")

	return db, nil
}

func getEnvOrDefault(key, defaultValue string) string {
	if value, exists := os.LookupEnv(key); exists {
		return value
	}

	return defaultValue
}

func main() {
	db, err := connectDb()

	if err != nil {
		panic(err)
	}

	rabbitMQUrl := getEnvOrDefault("RABBITMQ_URL", "amqp://guest:guest@rabbitmq:5672/")
	fmt.Print(rabbitMQUrl)
	rabbitClient, err := rabbitmq.NewRabbitClient(rabbitMQUrl)
	if err != nil {
		panic(err)
	}

	defer rabbitClient.Close()

	conversionExch := getEnvOrDefault("CONVERSION_EXCHANGE", "conversion_exchange")
	queueName := getEnvOrDefault("CONVERSION_QUEUE", "video_conversion_queue")
	conversionKey := getEnvOrDefault("CONVERSION_KEY", "conversion")
	confirmationKey := getEnvOrDefault("CONFIRMATION_KEY", "finish-conversion")
	confirmationQueue := getEnvOrDefault("CONFIRMATION_QUEUE", "video_confirmation_queue")

	vc := converter.NewVideoConverter(db, rabbitClient)
	msgs, err := rabbitClient.ConsumeMessages(conversionExch, conversionKey, queueName)
	if err != nil {
		slog.Error("Failed to consume messages", slog.String("error", err.Error()))
	}

	for msg := range msgs {
		go func(delivery amqp.Delivery) {
			vc.Handle(delivery, conversionExch, confirmationKey, confirmationQueue)
		}(msg)
	}
}
