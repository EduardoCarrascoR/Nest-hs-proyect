import { Column, Entity } from "typeorm";

@Entity("user_has_shift", { schema: "hs" })
export class UserHasShift {
  @Column("int", { name: "User_user_id" })
  userUserId: number;

  @Column("int", { name: "Shift_shift_id", nullable: true })
  shiftShiftId: number | null;
}
