import { Entity, Column, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class User {
    @PrimaryGeneratedColumn()
    user_id: number;

    @Column()
    firstname: string;
        
    @Column()
    lastname: string;
    
    @Column()
    role: string;

    @Column()
    phone: number;
    
    @Column()
    email: string;
    
    @Column()
    email_verified: boolean;

    @Column()
    password: string;  

    @Column()
    created_at: Date;
    
}
