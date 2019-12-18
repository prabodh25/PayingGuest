export interface apartment{
    id: string;
    ApartmentName: string;
    Type:string;
    AddressLine1:string;
    AddressLine2:string;
    AddressLine3:string;
    State:string;
    City:string;
    PIN:string;
    Phones:string[];
    BankAccount:string[];
    Partners:string[];
    IsDeleted:boolean;
}