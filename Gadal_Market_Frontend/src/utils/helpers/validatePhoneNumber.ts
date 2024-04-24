const phoneNumberRegex = /^(?:\+251|0)9\d{8}$/;

export default function validatePhoneNumber(phoneNumber: string): boolean {
    return phoneNumberRegex.test(phoneNumber);
}