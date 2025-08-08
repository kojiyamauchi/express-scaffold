import { z } from 'zod'

export const userSchema = z.object({
  name: z.string({ message: '氏名の形式が文字列ではありません' }).min(1, { message: '氏名は1文字以上で入力してください' }),
  url: z.url({ message: 'urlの形式が正しくありません' }),
  phone1: z
    .string()
    .min(1, { message: '電話番号:市外局番は1桁以上で入力してください' })
    .max(4, { message: '電話番号:市外局番は4桁以内で入力してください' })
    .regex(/^\d+$/, { message: '電話番号:市外局番は数字のみで入力してください' }),
  phone2: z
    .string()
    .min(1, { message: '電話番号:市内局番は1桁以上で入力してください' })
    .max(4, { message: '電話番号:市内局番は4桁以内で入力してください' })
    .regex(/^\d+$/, { message: '電話番号:市内局番は数字のみで入力してください' }),
  phone3: z
    .string()
    .length(4, { message: '電話番号:加入者番号は4桁で入力してください' })
    .regex(/^\d+$/, { message: '電話番号:加入者は数字のみで入力してください' }),
  email: z.email({ message: 'メールアドレスの形式が正しくありません' }),
})

export type UserSchemaType = z.infer<typeof userSchema>

export type User = {
  id: number
  name: string
  url: string
  phone: string
  email: string
  create_at: Date
  update_at: Date
}

export type UserList = User[]
