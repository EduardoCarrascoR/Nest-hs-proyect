import { Column, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { Shift } from "./Shift.entity";

@Entity("news", { schema: "hs" })
export class News {
  @PrimaryGeneratedColumn({ type: "int", name: "news_id" })
  newsId: number;

  @Column({ name: "shifts_shifts_id", type: "int", nullable: true })
  shiftsShiftsId: number;

  @Column({ name: "shift_client_client_id", type: "int", nullable: true })
  shiftclientId: number;

  @Column("varchar", { name: "title", nullable: true, length: 45 })
  title: string | null;

  @Column("varchar", { name: "description", nullable: true, length: 250 })
  description: string | null;

  @ManyToOne(() => Shift, (shift) => shift.news, {
    onDelete: "RESTRICT",
    onUpdate: "RESTRICT",
  })
  @JoinColumn([{ name: "shifts_shifts_id", referencedColumnName: "shiftId" },
    { name: "shift_client_client_id", referencedColumnName: "client" }
  ])
  shiftsShifts: Shift;
}
