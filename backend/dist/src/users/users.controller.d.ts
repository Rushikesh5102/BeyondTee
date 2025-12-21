import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
export declare class UsersController {
    private readonly usersService;
    constructor(usersService: UsersService);
    create(createUserDto: CreateUserDto): import(".prisma/client").Prisma.Prisma__UserClient<{
        id: string;
        name: string | null;
        createdAt: Date;
        updatedAt: Date;
        email: string;
        password: string;
        role: string;
    }, never, import("@prisma/client/runtime/library").DefaultArgs>;
    findAll(): import(".prisma/client").Prisma.PrismaPromise<{
        id: string;
        name: string | null;
        createdAt: Date;
        updatedAt: Date;
        email: string;
        password: string;
        role: string;
    }[]>;
    findOne(id: string): import(".prisma/client").Prisma.Prisma__UserClient<{
        id: string;
        name: string | null;
        createdAt: Date;
        updatedAt: Date;
        email: string;
        password: string;
        role: string;
    } | null, null, import("@prisma/client/runtime/library").DefaultArgs>;
    update(id: string, updateUserDto: UpdateUserDto): import(".prisma/client").Prisma.Prisma__UserClient<{
        id: string;
        name: string | null;
        createdAt: Date;
        updatedAt: Date;
        email: string;
        password: string;
        role: string;
    }, never, import("@prisma/client/runtime/library").DefaultArgs>;
    remove(id: string): import(".prisma/client").Prisma.Prisma__UserClient<{
        id: string;
        name: string | null;
        createdAt: Date;
        updatedAt: Date;
        email: string;
        password: string;
        role: string;
    }, never, import("@prisma/client/runtime/library").DefaultArgs>;
}
