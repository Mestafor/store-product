interface View {
    render: () => void;
}

// interface Purchase {
//     updateProductProperty: (name: string, value: string | number | boolean) => void;
// }

// interface IPurchaseProductDataLicenseList {
//     [id: string]: {
//         id: string;
//         title: string;
//         amount: number;
//     };
// }

// interface IPurchaseProductDataFormat {
//     id: string;
//     title?: string;
//     thumbnail?: string;
//     licenseList: IPurchaseProductDataLicenseList;
// }

// interface IPurchaseProductDataFormatList {
//     [id: string]: IPurchaseProductDataFormat;
// }

// interface IPurchaseProductData {
//     id: string;
//     title?: string;
//     author?: string;
//     thumbnail?: string;
//     source?: string;
//     amount: number;
//     currency: string;
//     discount: number;
//     format?: {
//         formatId: string;
//         licenseId: string;
//         formatList: IPurchaseProductDataFormatList;
//     };
//     bundle?: {
//         [id: string]: {
//             id: string;
//             amount: number;
//             title?: string;
//             thumbnail?: string;
//         }
//     };
//     crossell?: {
//         [id: string]: {
//             id: string;
//             amount: number;
//             title?: string;
//             thumbnail?: string;
//             used: boolean;
//         }
//     };
//     support?: {
//         [id: string]: {
//             id: string;
//             amount: number;
//             used: boolean;
//         }
//     };
//     subscription?: {
//         duration: number;
//         renew: boolean;
//         amounts: {
//             [name: string]: number;
//         }
//     };
// }

// interface IPurchaseInfoData {
//     amount: number;
//     currency: string;
//     promoCode?: string;
//     promoCodeDiscount?: number;
//     balance?: number;
//     products: string[]; // products id
//     latterProducts?: string[];
//     payments?: {
//         [id: string]: {
//             id: string;
//             used: boolean;
//             cardNumber?: number;
//             cardMonth?: number;
//             cardYear?: number;
//             cardCVV?: number;
//         }
//     };
// }

interface ProjectConfig {
    search: {
        endpoint: string;
    };
    
    assets: string;
}

interface Window {
    projectConfig: ProjectConfig;
    addWheelListener: (elem: HTMLElement, callback: Function, useCapture: boolean) => void;
}
