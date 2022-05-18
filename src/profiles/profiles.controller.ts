import { Controller, Delete, Get, Patch, Post } from '@nestjs/common';

@Controller('profiles')
export class ProfilesController {
    @Post()
    create() {}

    @Get()
    findAll() {}

    @Patch()
    update() {}

    @Delete()
    delete() {}
}
