import { userSchema } from '@/schemas'

describe('userSchema', () => {
  const validData = {
    name: '田中 正男',
    url: 'https://example.com',
    phone1: '090',
    phone2: '1234',
    phone3: '5678',
    email: 'foo@example.com',
  }

  it('pass with valid data', () => {
    expect(() => userSchema.parse(validData)).not.toThrow()
  })

  it('fail when name is empty', () => {
    const data = { ...validData, name: '' }
    expect(() => userSchema.parse(data)).toThrow('氏名は1文字以上で入力してください')
  })

  it('fail when url is empty', () => {
    const data = { ...validData, url: '' }
    expect(() => userSchema.parse(data)).toThrow('urlの形式が正しくありません')
  })

  it('fail when url is invalid', () => {
    const data = { ...validData, url: 'invalid-url' }
    expect(() => userSchema.parse(data)).toThrow('urlの形式が正しくありません')
  })

  it('fail when phone1 is empty', () => {
    const data = { ...validData, phone1: '' }
    expect(() => userSchema.parse(data)).toThrow('電話番号:市外局番は1桁以上で入力してください')
  })

  it('fail when phone1 is too long', () => {
    const data = { ...validData, phone1: '12345' }
    expect(() => userSchema.parse(data)).toThrow('電話番号:市外局番は4桁以内で入力してください')
  })

  it('fail when phone1 contains non-digit characters', () => {
    const data = { ...validData, phone1: '03a' }
    expect(() => userSchema.parse(data)).toThrow('電話番号:市外局番は数字のみで入力してください')
  })

  it('fail when phone3 is not exactly 4 digits', () => {
    const data = { ...validData, phone3: '123' }
    expect(() => userSchema.parse(data)).toThrow('電話番号:加入者番号は4桁で入力してください')
  })

  it('fail when email is empty', () => {
    const data = { ...validData, email: '' }
    expect(() => userSchema.parse(data)).toThrow('メールアドレスの形式が正しくありません')
  })

  it('fail when email is invalid', () => {
    const data = { ...validData, email: 'not-an-email' }
    expect(() => userSchema.parse(data)).toThrow('メールアドレスの形式が正しくありません')
  })
})
