import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { PrismaService } from '../prisma.service';
export declare class UsersService {
    private prisma;
    constructor(prisma: PrismaService);
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
    findByEmail(email: string): import(".prisma/client").Prisma.Prisma__UserClient<{
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
