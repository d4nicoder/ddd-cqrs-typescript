import fastify, { FastifyReply } from "fastify";
import { BusinessError } from "../shared/domain/BusinessError";
import { ValidationError } from "../shared/domain/ValidationError";
import { config } from "../shared/utils/config";
import { controllers } from "./controllers";
import { container } from "../shared/container/container";
import { ControllerResponse } from "../shared/domain/ControllerResponse";

const server = fastify({
	logger: true,
});

controllers.forEach((ctrl) => {
	const controller = container.get(ctrl);

	const wrapper = async (req: any, reply: FastifyReply) => {
		let res: ControllerResponse;
		try {
			res = await controller.handle(req);
			reply.status(res.statusCode).headers(res.headers).send(res.content);
		} catch (e: any) {
			reply.status(500).send({ error: "Internal error" });
		}
	};

	const { method, path } = controller.getDefinition();
	switch (method) {
		case "GET":
			server.get(path, wrapper);
			break;
		case "POST":
			server.post(path, wrapper);
			break;
		case "PUT":
			server.put(path, wrapper);
			break;
		case "PATCH":
			server.patch(path, wrapper);
			break;
		case "DELETE":
			server.delete(path, wrapper);
			break;
		default:
			console.error(`❌ Error registering [${method}] ${path}. Invalid method.`);
	}

	console.log(`✓ Registered controller [${method}] ${path}`);
});

server
	.listen({
		port: config.get("port"),
		host: "0.0.0.0",
	})
	.then(() => {
		console.log(`Listening on port ${config.get("port")}!`);
	});
