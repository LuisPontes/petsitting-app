

export const PermissionsOptions = {
    No_Permission: 0,
    Client: 1,
    Petsiter: 2,
    Adminstartor: 3
}
export const ReserveStatus = {
    OPEN: 0,
    ONGOING: 1,
    WAIT_PAYMENT: 2,
    CLOSE: 3
}

export const ServiceType = {
    WALK: 0,//Paseo,
    PLAYGROUNG: 1,//guardería
    RESIDENCE: 2//residencia
}

export const PaymentStatus = {
    RESERVE_PAYMENT_ON_HOLD: 0,// a espera do pagemnto de reserva
    RESERVE_PAYMENT_DONE: 1,//pagmento de reserva feito
    FULL_PAYMENT_ON_HOLD: 2,//a espera do pagamento total,
    FULL_PAYMENT_DONE : 3//pagamento total feito
}

// export const API_URL_AUTH = "http://192.168.0.10:3001/api/auth/pet/";
// export const API_URL_AUTH = "http://localhost:3001/api/auth/pet/";
 export const API_URL_AUTH = "https://app-5db88e86-f74e-4442-a7c7-f1e5288bd3e2.cleverapps.io/api/auth/pet/";


// export const API_URL_USER = "http://192.168.0.10:3001/api/pet/";
// export const API_URL_USER = "http://localhost:3001/api/pet/";
 export const API_URL_USER = "https://app-5db88e86-f74e-4442-a7c7-f1e5288bd3e2.cleverapps.io/api/pet/";


// export const API_URL_ADMIN = "http://192.168.0.10:3001/api/admin/";
// export const API_URL_ADMIN = "http://localhost:3001/api/admin/";
 export const API_URL_ADMIN = "https://app-5db88e86-f74e-4442-a7c7-f1e5288bd3e2.cleverapps.io/api/admin/";


// export const API_URL_PETSITER = "http://192.168.0.10:3001/api/mod/";
// export const API_URL_PETSITER = "http://localhost:3001/api/mod/";
 export const API_URL_PETSITER = "https://app-5db88e86-f74e-4442-a7c7-f1e5288bd3e2.cleverapps.io/api/mod/";
