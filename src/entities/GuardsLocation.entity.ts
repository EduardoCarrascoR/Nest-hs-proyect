import { Column, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { Shift } from "./Shift.entity";
import { User } from "./User.entity";

@Entity("guards_location", { schema: "hs"})
export class GuardsLocation {
    @PrimaryGeneratedColumn({ type: "int", name: "idguards_location"})
    guardLocationId: number;

    @Column("varchar", { name: "location", nullable: true, length: 200 })
    location: string | null;

    @Column({ name: "shift_shift_id", type: "int" })
    shiftId: number;
    
    @Column({ name: "shift_client_client_id", type: "int" })
    clientId: number;

    @Column({ name: "user_user_id", type: "int" })
    userId: number;

    @Column({ name: "time_location", type: "time", nullable: true })
    timeLocation: string;

    @UpdateDateColumn()
    updatedAt: Date;

    @ManyToOne(() => Shift, (shift) => shift.guardLocation, {})
    @JoinColumn([
        { name: "shift_shift_id", referencedColumnName: "shiftId" },
        { name: "shift_client_client_id", referencedColumnName: "client" },
    ])
    shift: Shift;

    @OneToMany(() => User, (user) => user.guardUserLocation, {})
    @JoinColumn([
        { name: "user_user_id", referencedColumnName: "id" },
    ])
    user: User;
}