import { AggregateRoot } from '../../../../shared/domain/AggregateRoot'
import { BoolValueObject } from '../../../../shared/domain/BoolValueObject'
import { DateValueObject } from '../../../../shared/domain/DateValueObject'
import { StringValueObject } from '../../../../shared/domain/StringValueObject'

export interface ClientDefinition {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  birthDate: Date;
  isVerified: boolean;
  isEnabled: boolean;
  createdAt: Date;
  timezone: string;
  language: string;
}

/**
 * @name Client
 * @description This is the client aggregate projection from the user aggregate of the SaaS context.
 * @context Backoffice
 * @version 1
 */
export class Client extends AggregateRoot<ClientDefinition> {
  private _firstName: StringValueObject;
  private _lastName: StringValueObject;
  private _email: StringValueObject;
  private _birthDate: DateValueObject;
  private _isVerified: BoolValueObject;
  private _isEnabled: BoolValueObject;
  private _createdAt: DateValueObject;
  private _timezone: StringValueObject;
  private _language: StringValueObject;

  constructor(props: ClientDefinition) {
    super(props.id)
    this._firstName = new StringValueObject(props.firstName)
    this._lastName = new StringValueObject(props.lastName)
    this._email = new StringValueObject(props.email)
    this._birthDate = new DateValueObject(props.birthDate)
    this._isVerified = new BoolValueObject(props.isVerified)
    this._isEnabled = new BoolValueObject(props.isEnabled)
    this._createdAt = new DateValueObject(props.createdAt)
    this._timezone = new StringValueObject(props.timezone)
    this._language = new StringValueObject(props.language)
  }

  toPrimitives (): ClientDefinition {
    return {
      id: this.id.value,
      firstName: this._firstName.value,
      lastName: this._lastName.value,
      email: this._email.value,
      birthDate: this._birthDate.value,
      isVerified: this._isVerified.value,
      isEnabled: this._isEnabled.value,
      createdAt: this._createdAt.value,
      timezone: this._timezone.value,
      language: this._language.value
    }
  }
}
