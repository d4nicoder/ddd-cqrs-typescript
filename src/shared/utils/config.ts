import convict from "convict";
import dotenv from "dotenv";

dotenv.config();

export const config = convict({
	env: {
		doc: "The application environment",
		format: ["production", "development", "test"],
		default: "development",
		env: "NODE_ENV",
	},
	port: {
		doc: "Http port",
		default: 3333,
		env: "HTTP_PORT",
	},
	jwt: {
		secret: {
			doc: "JWT secret",
			default: "supersecret",
			env: "JWT_SECRET",
		},
	},
	mongo: {
		write: {
			uri: {
				doc: "Mongo write connection uri",
				default: "mongodb://root:root@localhost",
				env: "MONGO_WRITE_URI",
			},
			database: {
				doc: "Mongo database name",
				default: "development",
				env: "MONGO_DB",
			},
		},
	},
	rabbit: {
		enabled: {
			doc: "Enable rabbit",
			default: false,
			env: "RABBIT_ENABLED",
			format: Boolean,
		},
		exchangeName: {
			doc: "Rabbit exchange name",
			default: "backoffice",
			env: "RABBIT_EXCHANGE_NAME",
		},
		uri: {
			doc: "Rabbit connection uri",
			default: "amqp://localhost",
			env: "RABBIT_URI",
		},
	},
});
