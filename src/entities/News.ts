import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity("news", { schema: "hs" })
export class News {
  @PrimaryGeneratedColumn({ type: "int", name: "news_id" })
  newsId: number;

  @Column("varchar", { name: "title", nullable: true, length: 45 })
  title: string | null;

  @Column("varchar", { name: "descripcion", nullable: true, length: 45 })
  descripcion: string | null;
}
