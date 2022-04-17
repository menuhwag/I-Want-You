import { registerAs } from "@nestjs/config";

export default registerAs('jwt', () => ({
    key: process.env.JWT_KEY,
}));