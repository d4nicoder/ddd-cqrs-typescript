import { randomBytes } from 'crypto'
import { BusinessError } from '../../../../shared/domain/BusinessError'
import { DateValueObject } from '../../../../shared/domain/DateValueObject'
import { IdValueObject } from '../../../../shared/domain/IdValueObject'
import { StringValueObject } from '../../../../shared/domain/StringValueObject'
import { Time } from '../../../../shared/utils/Time'

export interface UserTokenDefinition {
  id: string;
  token: string;
  name: string;
  expiresAt: Date;
}

export class UserToken {
  private readonly _id: IdValueObject
  private readonly _token: StringValueObject
  private readonly _name: StringValueObject
  private readonly _expiresAt: DateValueObject

  static create(name: string) {
    const token = randomBytes(32).toString('hex')
    const expiresAt = new Time().addMonths(1).toDate()
    const id = IdValueObject.generate().value
    return new UserToken({token, name, expiresAt, id})
  }

  constructor ({token, name, expiresAt, id}: UserTokenDefinition) {
    this._token = new StringValueObject(token)
    this._name = new StringValueObject(name)
    this._expiresAt = new DateValueObject(expiresAt)
    this._id = new IdValueObject(id)

    this._ensureIsValid()
  }

  private _ensureIsValid(){
    if (!this._name.value.trim()) {
      throw new BusinessError("Token name mandatory")
    }
  }

  toPrimitives(): UserTokenDefinition {
    return {
      id: this._id.value,
      token: this._token.value,
      name: this._name.value,
      expiresAt: this._expiresAt.value
    }
  }
}
