export class CreateDriverDto {
    readonly name: string;
    readonly surname: string;
    readonly age: number;
    readonly experience: string;
    readonly phoneNumber: string;
    readonly contractStartDate: Date;
    readonly workingHoursStart: string;
    readonly workingHoursEnd: string;
    readonly restDays: string;
    readonly taxiId: number;
  }
  