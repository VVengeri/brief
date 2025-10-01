// FIX: Added 'email' and 'tel' to support additional input types and resolve type errors in FormField.tsx.
export type FieldType = 'text' | 'number' | 'textarea' | 'enum' | 'multi-enum' | 'radio' | 'checkbox' | 'date' | 'multi-text' | 'email' | 'tel' | 'visual-single' | 'visual-multi' | 'room-counter' | 'file' | 'room-toggle-counter';

export interface IOption {
    value: string;
    label: string;
    image?: string;
    // FIX: Added optional 'info' property to support tooltips on options, resolving type errors.
    info?: string;
    colors?: string[];
    deepDive?: {
        [key: string]: string;
    };
    isHeader?: boolean;
}

export interface IAnnotation {
    x: number;
    y: number;
    type: 'socket' | 'switch' | 'lan' | 'tv' | 'text' | 'arrow' | 'frame' | 'line';
    text?: string;
    color?: string;
    fontSize?: number;
    // For arrow/line
    x2?: number;
    y2?: number;
    // For frame
    width?: number;
    height?: number;
}


export interface IFile {
    name: string;
    type: string;
    content: string; // base64 encoded content
    annotations?: IAnnotation[];
}

export interface IField {
    id: string;
    label: string;
    type: FieldType;
    placeholder?: string;
    options?: IOption[];
    condition?: (data: IFormData, fullFieldPath?: string) => boolean;
    required?: boolean;
    validation_error_message?: string;
    info?: string;
    roomType?: keyof IRoomConfig;
}

export interface ISection {
    id: string;
    title: string;
    description?: string;
    fields: IField[];
    subSections?: ISection[];
    condition?: (data: IFormData, fullFieldPath?: string) => boolean;
}

interface IRoomDetails {
    heated_floor_type: string;
    lighting_types: string[];
    lighting_controls: string[];
    lighting_cct: string;
    wall_finishes: string[];
    ceiling_finishes: string[];
    floor_finishes: string[];
}

export interface IBathroom extends IRoomDetails {
    equipment: string[];
    finishes: string[];
    engineering_notes: string;
    electrics_notes: string;
    electrics_points: string[];
}
export interface IBedroom extends IRoomDetails {
    functions: string[];
    bed_size: string;
    storage_needs: string;
    notes: string;
    electrics_notes: string;
    electrics_points: string[];
}
export interface IChildRoom extends IRoomDetails {
    age: number | '';
    gender: string;
    zones: string[];
    notes: string;
    electrics_notes: string;
    electrics_points: string[];
}
export interface IOffice extends IRoomDetails {
    work_type: string;
    equipment: string[];
    storage_needs: string;
    notes: string;
    electrics_notes: string;
    electrics_points: string[];
}
export interface ILivingRoom extends IRoomDetails {
    functions: string[];
    furniture: string;
    notes: string;
    electrics_notes: string;
    electrics_points: string[];
}
export interface IHallway extends IRoomDetails {
    functions: string[];
    furniture: string;
    notes: string;
    electrics_notes: string;
    electrics_points: string[];
}
export interface IWardrobe extends IRoomDetails {
    hanging_storage: string[];
    shelving_needs: string[];
    drawer_needs: string[];
    shoe_storage: 'yes' | 'no' | '';
    shoe_count: number | '';
    notes: string;
    electrics_notes: string;
    electrics_points: string[];
}
export interface ILaundry extends IRoomDetails {
    equipment: string[];
    functions: string;
    notes: string;
    electrics_notes: string;
    electrics_points: string[];
}
export interface IPantry extends IRoomDetails {
    storage_needs: string;
    notes: string;
    electrics_notes: string;
    electrics_points: string[];
}
export interface IBalcony extends IRoomDetails {
    type: string;
    purpose: string[];
    notes: string;
    electrics_notes: string;
    electrics_points: string[];
}


export interface IRoomConfig {
    bathrooms: number | '';
    bedrooms: number | '';
    child_rooms: number | '';
    offices: number | '';
    living_room: boolean;
    hallway: boolean;
    wardrobes: number | '';
    laundry: boolean;
    pantry: boolean;
    balconies: number | '';
    kitchen: boolean;
    kitchen_living: boolean;
}


export interface IKitchenDetails extends IRoomDetails {
    layout: string;
    appliances: string[];
    fridge_type: 'built_in' | 'standalone' | '';
    hob_type: 'induction' | 'electric' | 'gas' | '';
    hob_burners: '2' | '3' | '4' | '5+' | '';
    worktop_material: string;
    worktop_other: string;
    electrics_notes: string;
    electrics_points: string[];
}

export interface IKitchenLiving extends IRoomDetails {
    layout: string;
    appliances: string[];
    fridge_type: 'built_in' | 'standalone' | '';
    hob_type: 'induction' | 'electric' | 'gas' | '';
    hob_burners: '2' | '3' | '4' | '5+' | '';
    worktop_material: string;
    worktop_other: string;
    functions: string[];
    furniture: string;
    electrics_notes: string;
    electrics_points: string[];
}

export interface IElectricsGeneral {
    panel_notes: string;
    electrics_plan: IFile[];
}

export interface IVentilation {
    kitchen_hood_type: string;
    bathroom_fan_type: string;
    additional_ventilation_notes: string;
}

export interface IFormData {
    project: {
        type: string;
        address: string;
        area: number | '';
        exploitation_mode: string;
    };
    client: {
        name: string;
        phone: string;
        email: string;
        messenger: string[];
        data_consent: boolean;
    };
    household: {
        members: string;
    };
    goals: {
        top_3_tasks: string[];
        success_criteria: string;
        constraints: string;
    };
    style: {
        styles: string[];
        palettes: string[];
        palette_notes: string;
        materials: string[];
        references: string;
        references_files: IFile[];
    };
    budget: {
        range: string;
        custom_amount: number | '';
        include_furniture_tech: 'yes' | 'no' | '';
        deadline: string;
        pace: string;
    };
    replanning: {
        needed: 'yes' | 'no' | '';
        bti_plan: IFile[];
        constraints: string[];
    };
    room_config: IRoomConfig;
    kitchen_details?: IKitchenDetails;
    kitchen_living?: IKitchenLiving;
    bathrooms: IBathroom[];
    bedrooms: IBedroom[];
    child_rooms: IChildRoom[];
    offices: IOffice[];
    living_room?: ILivingRoom;
    hallway?: IHallway;
    wardrobes: IWardrobe[];
    laundry?: ILaundry;
    pantry?: IPantry;
    balconies: IBalcony[];
    
    electrics_general: IElectricsGeneral;
    ventilation: IVentilation;
    additional: {
        safety_notes: string;
        wishes_taboos: string;
    };
    confirmation: {
        data_correct: boolean;
        signature: string;
        date: string;
    };
}