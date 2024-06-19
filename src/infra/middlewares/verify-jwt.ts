import { FastifyReply, FastifyRequest } from "fastify";

export async function verifyJWT(request: FastifyRequest, reply: FastifyReply) {
  try {
    await request.jwtVerify();

    if (!request.user || !request.user.sub) {
      throw new Error("Invalid token: missing sub claim");
    }
  } catch (err) {
    return reply.status(401).send({ message: "Unauthorized." });
  }
}
