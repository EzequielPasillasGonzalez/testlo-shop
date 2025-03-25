import { Column, Entity, PrimaryColumn, PrimaryGeneratedColumn } from "typeorm";

@Entity({ name: 'users' })
export class User {
    @PrimaryGeneratedColumn('uuid')
    id: string

    @Column('text', {
        unique: true,
    })
    email: string

    @Column('text', {
        select: false, // No trae el password con el find
    })
    password: string


    @Column('text')
    fullName: string

    @Column('bool', {
        default: true
    })
    isActive: boolean

    @Column('text', {
        array: true,
        default: ['user'],
    })
    roles: string[]
}
