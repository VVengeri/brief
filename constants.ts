// FIX: Import `IField` type to resolve TypeScript error.
import { IFormData, ISection, IField } from './types';
import { styleImages } from './assets/styleImages';
import { paletteImages } from './assets/paletteImages';

const getValueFromPathForCondition = (obj: any, path: string): any => {
    return path.split('.').reduce((acc, part) => {
        if (acc === null || acc === undefined) return undefined;
        const index = parseInt(part, 10);
        if (!isNaN(index) && Array.isArray(acc)) { return acc[index]; }
        return acc[part];
    }, obj);
};

const roomDetailsSubSections: ISection[] = [
    {
        id: 'climate_subsection',
        title: 'Климат и тепло',
        fields: [
            { id: 'heated_floor_type', label: 'Теплый пол', type: 'enum', options: [
                { value: 'none', label: 'Не требуется'},
                { value: 'electric_cord', label: 'Электрический (шнуровой)', info: 'Гибкий кабель, подходит для помещений сложной формы.' },
                { value: 'electric_mat', label: 'Электрический (маты)', info: 'Простой и быстрый монтаж, идеально для стандартных помещений.' },
                { value: 'electric_infrared', label: 'Инфракрасный (пленочный)', info: 'Очень тонкий, подходит под ламинат и кварцвинил, но не под плитку.' },
                { value: 'water', label: 'Водяной', info: 'Экономичный в эксплуатации, но сложный монтаж и разрешен не во всех домах.' }
            ]}
        ]
    },
    {
        id: 'lighting_subsection',
        title: 'Освещение',
        fields: [
             { id: 'lighting_types', label: 'Типы освещения', type: 'multi-enum', options: [
                { value: 'general_ceiling', label: 'Общий потолочный (точечные/треки)' },
                { value: 'general_chandelier', label: 'Общий (люстра)'},
                { value: 'accent_spot', label: 'Акцентный (споты)' },
                { value: 'functional_pendant', label: 'Функциональный (подвес над зоной)' },
                { value: 'decorative_sconce', label: 'Декоративный (бра)' },
                { value: 'decorative_floorlamp', label: 'Декоративный (торшер)' },
                { value: 'led_strip', label: 'Светодиодная подсветка' },
                { value: 'night_light', label: 'Ночной/дежурный свет' }
             ]},
             { id: 'lighting_controls', label: 'Управление светом', type: 'multi-enum', options: [{value: 'pass_through', label: 'Проходные выключатели'}, {value: 'dimmer', label: 'Диммеры'}, {value: 'motion_sensor', label: 'Датчики движения'}] },
             { id: 'lighting_cct', label: 'Предпочтительная цветовая температура', type: 'enum', options: [{value: '3000k', label: 'Тёплый свет (3000К)'}, {value: '4000k', label: 'Нейтральный свет (4000К)'}, {value: 'adjustable', label: 'Регулируемая'}] },
        ]
    },
    {
        id: 'finishes_subsection',
        title: 'Отделка',
        fields: [
             { id: 'wall_finishes', label: 'Отделка стен', type: 'multi-enum', options: [
                {value: 'paint', label: 'Краска'}, 
                {value: 'wallpaper_texture', label: 'Обои под покраску (фактурные)'}, 
                {value: 'wallpaper_pattern', label: 'Обои с рисунком (акцентные)'}, 
                {value: 'plaster', label: 'Декоративная штукатурка'},
                {value: 'panels_wood', label: 'Декоративные панели (дерево/МДФ)'},
                {value: 'panels_soft', label: 'Декоративные панели (мягкие)'},
                {value: 'microcement', label: 'Микроцемент'},
                {value: 'tile_large', label: 'Керамогранит (крупный формат)'},
                {value: 'tile_small', label: 'Плитка (мелкий формат)'},
             ]},
             { id: 'ceiling_finishes', label: 'Потолок', type: 'multi-enum', options: [
                {value: 'paint', label: 'Покраска'}, 
                {value: 'stretch_matte', label: 'Натяжной (матовый)'}, 
                {value: 'drywall', label: 'ГКЛ (гипсокартон)'}, 
                {value: 'concrete', label: 'Бетон (без отделки)'}
             ] },
             { id: 'floor_finishes', label: 'Напольные покрытия', type: 'multi-enum', options: [
                {value: 'parquet', label: 'Паркет/инженерная доска'}, 
                {value: 'laminate', label: 'Ламинат'},
                {value: 'quartzvinyl', label: 'Кварцвинил'}, 
                {value: 'tile', label: 'Керамогранит'},
                {value: 'linoleum', label: 'Линолеум'},
                {value: 'microcement', label: 'Микроцемент/наливной пол'},
             ]},
        ]
    }
];

const applySubSectionsToTemplate = (template: any, type: string) => {
    const newTemplate = JSON.parse(JSON.stringify(template));
    newTemplate.subSections = JSON.parse(JSON.stringify(roomDetailsSubSections));
    newTemplate.subSections.forEach((sub: ISection) => {
        sub.fields.forEach((field: IField) => {
            field.id = `${type}.${field.id}`;
        });
    });
    return newTemplate;
}

const roomBaseFields = {
    heated_floor_type: '', 
    lighting_types: [], 
    lighting_controls: [], 
    lighting_cct: '', 
    wall_finishes: [], 
    ceiling_finishes: [], 
    floor_finishes: []
}

export const initialFormData: IFormData = {
    project: { type: '', address: '', area: '', exploitation_mode: '' },
    client: { name: '', phone: '+7 ', email: '', messenger: [], data_consent: false },
    household: { members: '' },
    goals: { top_3_tasks: [], success_criteria: '', constraints: '' },
    style: { styles: [], palettes: [], palette_notes: '', materials: [], references: '', references_files: [] },
    budget: { range: '', custom_amount: '', include_furniture_tech: '', deadline: '', pace: '' },
    replanning: { needed: '', bti_plan: [], constraints: [] },
    room_config: { 
        bathrooms: 1, 
        bedrooms: 1, 
        child_rooms: 0, 
        offices: 0, 
        living_room: true,
        hallway: true,
        wardrobes: 0,
        laundry: false,
        pantry: false,
        balconies: 0,
        kitchen: true,
        kitchen_living: false,
    },
    kitchen_details: { layout: '', appliances: [], fridge_type: '', hob_type: '', hob_burners: '', worktop_material: '', worktop_other: '', electrics_notes: '', electrics_points: [], ...roomBaseFields },
    kitchen_living: { layout: '', appliances: [], fridge_type: '', hob_type: '', hob_burners: '', worktop_material: '', worktop_other: '', functions: [], furniture: '', electrics_notes: '', electrics_points: [], ...roomBaseFields },
    bathrooms: [{ equipment: [], finishes: [], engineering_notes: '', electrics_notes: '', electrics_points: [], ...roomBaseFields }],
    bedrooms: [{ functions: [], bed_size: '', storage_needs: '', notes: '', electrics_notes: '', electrics_points: [], ...roomBaseFields }],
    child_rooms: [],
    offices: [],
    living_room: { functions: [], furniture: '', notes: '', electrics_notes: '', electrics_points: [], ...roomBaseFields },
    hallway: { functions: [], furniture: '', notes: '', electrics_notes: '', electrics_points: [], ...roomBaseFields },
    wardrobes: [],
    laundry: { equipment: [], functions: '', notes: '', electrics_notes: '', electrics_points: [], ...roomBaseFields },
    pantry: { storage_needs: '', notes: '', electrics_notes: '', electrics_points: [], ...roomBaseFields },
    balconies: [],
    electrics_general: { panel_notes: '', electrics_plan: [] },
    ventilation: { kitchen_hood_type: '', bathroom_fan_type: '', additional_ventilation_notes: '' },
    additional: { safety_notes: '', wishes_taboos: '' },
    confirmation: { data_correct: false, signature: '', date: '' },
};

export const bedroomSectionTemplate: ISection = applySubSectionsToTemplate({
    id: 'bedrooms',
    title: 'Детализация: Спальня',
    fields: [
        { id: 'bedrooms.functions', label: 'Дополнительные функции (кроме сна)', type: 'multi-enum', options: [{value: 'reading', label: 'Зона для чтения'}, {value: 'makeup', label: 'Туалетный столик'}, {value: 'workspace', label: 'Рабочее место'}, {value: 'tv', label: 'ТВ-зона'}] },
        { id: 'bedrooms.bed_size', label: 'Размер кровати', type: 'enum', options: [{value: 'none', label: 'Кровать не требуется'},{value: '160', label: '160x200 см'}, {value: '180', label: '180x200 см'}, {value: '200', label: '200x200 см'}, {value: 'custom', label: 'Другой'}] },
        { id: 'bedrooms.storage_needs', label: 'Что необходимо хранить?', type: 'textarea', placeholder: 'Например: одежда (платья, костюмы), постельное белье, книги' },
        { id: 'bedrooms.notes', label: 'Особые пожелания', type: 'textarea' },
        { id: 'bedrooms.electrics_notes', label: 'Электрика в этом помещении: розетки, выключатели', type: 'textarea', placeholder: 'Пример: у кровати по 2 розетки с каждой стороны, одна для пылесоса у двери, выключатель у входа и дублирующие у кровати.' },
        { id: 'bedrooms.electrics_points', label: 'Специальные выводы в спальне', type: 'multi-enum', options: [{value: 'bedside_sconces', label: 'Выводы под бра у кровати'}, {value: 'usb_bedside', label: 'USB-розетки у кровати'}, {value: 'tv_point', label: 'ТВ-зона'}] }
    ]
}, 'bedrooms');

export const childRoomSectionTemplate: ISection = applySubSectionsToTemplate({
    id: 'child_rooms',
    title: 'Детализация: Детская',
    fields: [
        { id: 'child_rooms.age', label: 'Возраст ребенка', type: 'number', required: true },
        { id: 'child_rooms.gender', label: 'Пол', type: 'radio', options: [{value: 'boy', label: 'Мальчик'}, {value: 'girl', label: 'Девочка'}] },
        { id: 'child_rooms.zones', label: 'Необходимые зоны', type: 'multi-enum', options: [{value: 'sleep', label: 'Спальная'}, {value: 'study', label: 'Учебная'}, {value: 'play', label: 'Игровая'}, {value: 'sport', label: 'Спортивная'}], required: true },
        { id: 'child_rooms.notes', label: 'Особые пожелания (увлечения, любимые цвета)', type: 'textarea' },
        { id: 'child_rooms.electrics_notes', label: 'Электрика в этом помещении', type: 'textarea', placeholder: 'Розетки у стола, у кровати, выключатели у входа и у кровати (ночник).' },
        { id: 'child_rooms.electrics_points', label: 'Специальные выводы', type: 'multi-enum', options: [{value: 'night_light', label: 'Вывод для ночника'}, {value: 'usb_desk', label: 'USB-розетки у стола'}] }
    ]
}, 'child_rooms');

export const officeSectionTemplate: ISection = applySubSectionsToTemplate({
    id: 'offices',
    title: 'Детализация: Кабинет',
    fields: [
        { id: 'offices.work_type', label: 'Тип работы', type: 'textarea', placeholder: 'Например: работа с документами, видеозвонки, творчество', required: true },
        { id: 'offices.equipment', label: 'Какое оборудование будет использоваться?', type: 'multi-enum', options: [{value: 'laptop', label: 'Ноутбук'}, {value: 'desktop', label: 'Стационарный ПК (2+ монитора)'}, {value: 'printer', label: 'Принтер/МФУ'}] },
        { id: 'offices.storage_needs', label: 'Что необходимо хранить?', type: 'textarea', placeholder: 'Например: документы, книги, образцы' },
        { id: 'offices.notes', label: 'Особые пожелания (освещение, шумоизоляция)', type: 'textarea' },
        { id: 'offices.electrics_notes', label: 'Электрика в этом помещении', type: 'textarea', placeholder: 'Группа розеток на рабочем столе, розетка для принтера, интернет-розетка.' },
        { id: 'offices.electrics_points', label: 'Специальные выводы', type: 'multi-enum', options: [{value: 'lan_socket', label: 'Проводная интернет-розетка (LAN)'}, {value: 'floor_socket', label: 'Розетка в полу (если стол не у стены)'}] }
    ]
}, 'offices');

export const bathroomSectionTemplate: ISection = applySubSectionsToTemplate({
    id: 'bathrooms', // Base ID
    title: 'Детализация: Санузел', // Base title
    fields: [
        { id: 'bathrooms.equipment', label: 'Оборудование', type: 'multi-enum', options: [{value: 'bath', label: 'Ванна'}, {value: 'shower', label: 'Душевая кабина/трап'}, {value: 'wc_install', label: 'Инсталляция с унитазом'}, {value: 'bidet', label: 'Биде / гиг. душ'}, {value: 'towel_warmer', label: 'Полотенцесушитель'}], required: true },
        { id: 'bathrooms.finishes', label: 'Особая отделка', type: 'multi-enum', options: [{value: 'tile', label: 'Керамогранит/плитка'}, {value: 'stone', label: 'Натуральный камень'}, {value: 'paint', label: 'Влагостойкая краска'}, {value: 'panels', label: 'Декоративные панели'}] },
        { id: 'bathrooms.engineering_notes', label: 'Пожелания по инженерии (трапы, ниши, ревизии)', type: 'textarea' },
        { id: 'bathrooms.electrics_notes', label: 'Электрика в этом помещении', type: 'textarea', placeholder: 'Розетка у раковины, для стиральной машины, вывод для подсветки зеркала.' },
        { id: 'bathrooms.electrics_points', label: 'Специальные выводы', type: 'multi-enum', options: [{value: 'washing_machine', label: 'Розетка для стиральной/сушильной машины'}, {value: 'mirror_light', label: 'Вывод для подсветки зеркала'}] }
    ]
}, 'bathrooms');

export const livingRoomSectionTemplate: ISection = applySubSectionsToTemplate({
    id: 'living_room',
    title: 'Детализация: Гостиная',
    condition: (data) => data.room_config.living_room,
    fields: [
        { id: 'living_room.functions', label: 'Основные функции', type: 'multi-enum', options: [{value: 'guests', label: 'Прием гостей'}, {value: 'cinema', label: 'Домашний кинотеатр'}, {value: 'reading', label: 'Зона для чтения'}, {value: 'family_evenings', label: 'Тихие семейные вечера'}] },
        { id: 'living_room.furniture', label: 'Какая основная мебель планируется?', type: 'textarea', placeholder: 'Например: большой диван, кресла, ТВ-зона, стеллаж для книг' },
        { id: 'living_room.notes', label: 'Особые пожелания', type: 'textarea' },
        { id: 'living_room.electrics_notes', label: 'Электрика в этом помещении', type: 'textarea', placeholder: 'Группа розеток в ТВ-зоне, у дивана, для торшера, для пылесоса.' },
        { id: 'living_room.electrics_points', label: 'Специальные выводы', type: 'multi-enum', options: [{value: 'tv_zone', label: 'ТВ-зона (HDMI, LAN, эл.)'}, {value: 'projector_point', label: 'Вывод для проектора'}, {value: 'sound_system', label: 'Выводы для аудиосистемы'}] }
    ]
}, 'living_room');

export const hallwaySectionTemplate: ISection = applySubSectionsToTemplate({
    id: 'hallway',
    title: 'Детализация: Прихожая / Холл',
    condition: (data) => data.room_config.hallway,
    fields: [
        { id: 'hallway.functions', label: 'Основные функции', type: 'multi-enum', options: [{value: 'storage_outerwear', label: 'Хранение верхней одежды'}, {value: 'storage_shoes', label: 'Хранение обуви'}, {value: 'mirror_zone', label: 'Зеркало в полный рост'}, {value: 'seating', label: 'Место для сидения'}] },
        { id: 'hallway.furniture', label: 'Какая мебель планируется?', type: 'textarea', placeholder: 'Например: шкаф, консоль, пуф, зеркало' },
        { id: 'hallway.notes', label: 'Особые пожелания (например, тип напольного покрытия)', type: 'textarea' },
        { id: 'hallway.electrics_notes', label: 'Электрика в этом помещении', type: 'textarea', placeholder: 'Розетка для сушилки обуви, для пылесоса, выключатели проходные.' },
        { id: 'hallway.electrics_points', label: 'Специальные выводы', type: 'multi-enum', options: [{value: 'router_point', label: 'Место для Wi-Fi роутера'}, {value: 'intercom', label: 'Домофон'}] }
    ]
}, 'hallway');

export const wardrobeSectionTemplate: ISection = applySubSectionsToTemplate({
    id: 'wardrobes',
    title: 'Детализация: Гардеробная',
    fields: [
        { id: 'wardrobes.hanging_storage', label: 'Штанги для одежды', type: 'multi-enum', options: [{value: 'long', label: 'Для длинной одежды (платья, пальто)'}, {value: 'short', label: 'Для короткой одежды (рубашки, брюки)'}] },
        { id: 'wardrobes.shelving_needs', label: 'Полки', type: 'multi-enum', options: [{value: 'sweaters', label: 'Для свитеров и трикотажа'}, {value: 'bags', label: 'Для сумок'}, {value: 'boxes', label: 'Для коробок'}] },
        { id: 'wardrobes.drawer_needs', label: 'Выдвижные ящики', type: 'multi-enum', options: [{value: 'underwear', label: 'Для нижнего белья'}, {value: 'accessories', label: 'Для аксессуаров (ремни, галстуки)'}] },
        { id: 'wardrobes.shoe_storage', label: 'Нужна ли специальная система для обуви?', type: 'radio', options: [{value: 'yes', label: 'Да'}, {value: 'no', label: 'Нет'}] },
        { 
            id: 'wardrobes.shoe_count', 
            label: 'Примерное количество пар обуви', 
            type: 'number', 
            placeholder: '15',
            condition: (data: IFormData, fullFieldPath?: string) => {
                if (!fullFieldPath) return false;
                const shoeStoragePath = fullFieldPath.replace('.shoe_count', '.shoe_storage');
                const value = getValueFromPathForCondition(data, shoeStoragePath);
                return value === 'yes';
            }
        },
        { id: 'wardrobes.notes', label: 'Особые пожелания (наличие зеркала, освещение)', type: 'textarea' },
        { id: 'wardrobes.electrics_notes', label: 'Электрика в этом помещении', type: 'textarea', placeholder: 'Розетка для отпаривателя, подсветка полок.' },
        { id: 'wardrobes.electrics_points', label: 'Специальные выводы', type: 'multi-enum', options: [{value: 'led_lighting', label: 'Выводы для подсветки полок/штанг'}] }
    ]
}, 'wardrobes');

export const laundrySectionTemplate: ISection = applySubSectionsToTemplate({
    id: 'laundry',
    title: 'Детализация: Постирочная',
    condition: (data) => data.room_config.laundry,
    fields: [
        { id: 'laundry.equipment', label: 'Оборудование', type: 'multi-enum', options: [{value: 'washer', label: 'Стиральная машина'}, {value: 'dryer', label: 'Сушильная машина'}, {value: 'sink', label: 'Раковина'}] },
        { id: 'laundry.functions', label: 'Дополнительные функции', type: 'textarea', placeholder: 'Например: гладильная зона, хранение бытовой химии' },
        { id: 'laundry.notes', label: 'Особые пожелания', type: 'textarea' },
        { id: 'laundry.electrics_notes', label: 'Электрика в этом помещении', type: 'textarea', placeholder: 'Розетки для стиральной и сушильной машин, для утюга.' },
        { id: 'laundry.electrics_points', label: 'Специальные выводы', type: 'multi-enum', options: [{value: 'washer_dryer_point', label: 'Силовые розетки для стиральной/сушильной машины'}] }
    ]
}, 'laundry');

export const pantrySectionTemplate: ISection = applySubSectionsToTemplate({
    id: 'pantry',
    title: 'Детализация: Кладовая',
    condition: (data) => data.room_config.pantry,
    fields: [
        { id: 'pantry.storage_needs', label: 'Что преимущественно будет храниться?', type: 'textarea', placeholder: 'Например: бытовая техника, спортивный инвентарь, запасы продуктов' },
        { id: 'pantry.notes', label: 'Особые пожелания (тип стеллажей, доступ)', type: 'textarea' },
        { id: 'pantry.electrics_notes', label: 'Электрика в этом помещении', type: 'textarea', placeholder: 'Розетка для зарядки техники (пылесос и т.д.).' },
        { id: 'pantry.electrics_points', label: 'Специальные выводы', type: 'multi-enum', options: [] }
    ]
}, 'pantry');

export const balconySectionTemplate: ISection = applySubSectionsToTemplate({
    id: 'balconies',
    title: 'Детализация: Балкон / Лоджия',
    fields: [
        { id: 'balconies.type', label: 'Тип', type: 'radio', options: [{value: 'open', label: 'Открытый'}, {value: 'glazed', label: 'Остекленный'}] },
        { id: 'balconies.purpose', label: 'Назначение', type: 'multi-enum', options: [{value: 'lounge', label: 'Зона отдыха'}, {value: 'storage', label: 'Место для хранения'}, {value: 'workspace', label: 'Рабочее место'}] },
        { id: 'balconies.notes', label: 'Особые пожелания (утепление, освещение)', type: 'textarea' },
        { id: 'balconies.electrics_notes', label: 'Электрика в этом помещении', type: 'textarea', placeholder: 'Розетка, вывод для светильника.' },
        { id: 'balconies.electrics_points', label: 'Специальные выводы', type: 'multi-enum', options: [{value: 'heated_floor_regulator', label: 'Регулятор теплого пола'}] }
    ]
}, 'balconies');

export const kitchenSectionTemplate: ISection = applySubSectionsToTemplate({
    id: 'kitchen_details',
    title: 'Детализация: Кухня',
    condition: (data) => data.room_config.kitchen,
    fields: [
        { id: 'kitchen_details.layout', label: 'Конфигурация кухни', type: 'enum', options: [{value: 'linear', label: 'Линейная', info: 'Компактный вариант, подходит для небольших или узких помещений.'}, {value: 'g-shape', label: 'Г-образная', info: 'Универсальный и эргономичный вариант, создает удобный рабочий треугольник.'}, {value: 'p-shape', label: 'П-образная', info: 'Максимально задействует пространство, много мест для хранения и рабочих поверхностей. Подходит для просторных кухонь.'}, {value: 'island', label: 'С островом', info: 'Современное решение для больших кухонь-гостиных. Остров может быть рабочей зоной, местом для завтраков или хранения.'}, {value: 'peninsula', label: 'С полуостровом'}] },
        { id: 'kitchen_details.appliances', label: 'Необходимая техника', type: 'multi-enum', options: [{value: 'fridge', label: 'Холодильник'}, {value: 'oven', label: 'Духовой шкаф'}, {value: 'hob', label: 'Варочная панель'}, {value: 'microwave', label: 'СВЧ-печь'}, {value: 'dishwasher', label: 'Посудомоечная машина'}, {value: 'hood', label: 'Вытяжка'}, {value: 'coffee_machine', label: 'Кофемашина'}, {value: 'water_filter', label: 'Фильтр для воды'}] },
        { id: 'kitchen_details.fridge_type', label: 'Тип холодильника', type: 'radio', options: [{ value: 'built_in', label: 'Встроенный' }, { value: 'standalone', label: 'Отдельностоящий' }], condition: (data: IFormData) => data.kitchen_details.appliances.includes('fridge') },
        { id: 'kitchen_details.hob_type', label: 'Тип варочной панели', type: 'radio', options: [{ value: 'induction', label: 'Индукционная' }, { value: 'electric', label: 'Электрическая' }, { value: 'gas', label: 'Газовая' }], condition: (data: IFormData) => data.kitchen_details.appliances.includes('hob') },
        { id: 'kitchen_details.hob_burners', label: 'Количество конфорок', type: 'enum', options: [{ value: '2', label: '2' }, { value: '3', label: '3' }, { value: '4', label: '4' }, { value: '5+', label: '5+' }], condition: (data: IFormData) => data.kitchen_details.appliances.includes('hob') },
        { id: 'kitchen_details.worktop_material', label: 'Материал столешницы', type: 'enum', options: [{value: 'quartz', label: 'Кварцевый агломерат', info: 'Очень прочный, не впитывает влагу, не царапается. Оптимальный выбор.'}, {value: 'stone_natural', label: 'Натуральный камень', info: 'Красивый, но может быть пористым и требовать ухода (например, мрамор).'}, {value: 'laminate', label: 'ЛДСП/пластик', info: 'Бюджетный вариант, большой выбор декоров, но менее долговечен.'}, {value: 'other', label: 'Другое'}]},
        { id: 'kitchen_details.worktop_other', label: 'Укажите другой материал', type: 'text', condition: (data: IFormData) => data.kitchen_details.worktop_material === 'other' },
        { id: 'kitchen_details.electrics_notes', label: 'Электрика в этом помещении', type: 'textarea', placeholder: 'Розетки для основной техники, над столешницей, для мелкой техники (чайник, тостер).' },
        { id: 'kitchen_details.electrics_points', label: 'Специальные выводы', type: 'multi-enum', options: [{value: 'disposer', label: 'Розетка для измельчителя отходов'}, {value: 'led_worktop', label: 'Вывод для подсветки рабочей зоны'}] }
    ]
}, 'kitchen_details');

export const kitchenLivingSectionTemplate: ISection = applySubSectionsToTemplate({
    id: 'kitchen_living',
    title: 'Детализация: Кухня-гостиная',
    condition: (data) => data.room_config.kitchen_living,
    fields: [
        { id: 'kitchen_living.layout', label: 'Конфигурация кухни', type: 'enum', options: [{value: 'linear', label: 'Линейная'}, {value: 'g-shape', label: 'Г-образная'}, {value: 'p-shape', label: 'П-образная'}, {value: 'island', label: 'С островом'}, {value: 'peninsula', label: 'С полуостровом'}] },
        { id: 'kitchen_living.appliances', label: 'Необходимая техника', type: 'multi-enum', options: [{value: 'fridge', label: 'Холодильник'}, {value: 'oven', label: 'Духовой шкаф'}, {value: 'hob', label: 'Варочная панель'}, {value: 'microwave', label: 'СВЧ-печь'}, {value: 'dishwasher', label: 'Посудомоечная машина'}, {value: 'hood', label: 'Вытяжка'}, {value: 'coffee_machine', label: 'Кофемашина'}, {value: 'water_filter', label: 'Фильтр для воды'}] },
        { id: 'kitchen_living.fridge_type', label: 'Тип холодильника', type: 'radio', options: [{ value: 'built_in', label: 'Встроенный' }, { value: 'standalone', label: 'Отдельностоящий' }], condition: (data: IFormData) => data.kitchen_living.appliances.includes('fridge') },
        { id: 'kitchen_living.worktop_material', label: 'Материал столешницы', type: 'enum', options: [{value: 'quartz', label: 'Кварцевый агломерат'}, {value: 'stone_natural', label: 'Натуральный камень'}, {value: 'laminate', label: 'ЛДСП/пластик'}, {value: 'other', label: 'Другое'}]},
        { id: 'kitchen_living.worktop_other', label: 'Укажите другой материал', type: 'text', condition: (data: IFormData) => data.kitchen_living.worktop_material === 'other' },
        { id: 'kitchen_living.functions', label: 'Основные функции гостиной зоны', type: 'multi-enum', options: [{value: 'guests', label: 'Прием гостей'}, {value: 'cinema', label: 'Домашний кинотеатр'}, {value: 'reading', label: 'Зона для чтения'}, {value: 'family_evenings', label: 'Тихие семейные вечера'}] },
        { id: 'kitchen_living.furniture', label: 'Какая основная мебель планируется в гостиной зоне?', type: 'textarea', placeholder: 'Например: большой диван, кресла, ТВ-зона, стеллаж для книг' },
        { id: 'kitchen_living.electrics_notes', label: 'Электрика в этом помещении', type: 'textarea', placeholder: 'Розетки для основной техники, над столешницей, в ТВ-зоне, у дивана.' },
        { id: 'kitchen_living.electrics_points', label: 'Специальные выводы', type: 'multi-enum', options: [{value: 'disposer', label: 'Розетка для измельчителя отходов'}, {value: 'led_worktop', label: 'Вывод для подсветки рабочей зоны'}, {value: 'tv_zone', label: 'ТВ-зона (HDMI, LAN, эл.)'}, {value: 'sound_system', label: 'Выводы для аудиосистемы'}] }
    ]
}, 'kitchen_living');

export const summarySection: ISection = {
    id: 'summary',
    title: 'Сводка и подтверждение',
    description: 'Пожалуйста, проверьте все введенные данные. Если нужно что-то исправить, нажмите "Изменить" рядом с соответствующим разделом.',
    fields: []
};

export const confirmationSection: ISection = {
    id: 'confirmation',
    title: 'Подтверждение',
    fields: [
        { id: 'confirmation.data_correct', label: 'Я подтверждаю корректность предоставленных данных', type: 'checkbox', required: true, validation_error_message: "Пожалуйста, подтвердите корректность данных" },
        { id: 'confirmation.signature', label: 'Подпись (введите ваше ФИО)', type: 'text', required: true },
        { id: 'confirmation.date', label: 'Дата заполнения', type: 'date', required: true },
    ]
};

export const formSections: ISection[] = [
    {
        id: 'project',
        title: '1. Паспорт проекта',
        description: 'Основная информация об объекте.',
        fields: [
            { id: 'project.type', label: 'Тип объекта', type: 'enum', options: [{ value: 'apartment', label: 'Квартира' }, { value: 'apartments', label: 'Апартаменты' }, { value: 'house', label: 'Дом' }], required: true },
            { id: 'project.address', label: 'Адрес (ЖК, секция, этаж)', type: 'text', placeholder: 'г. Москва, ул. Примерная, д. 1, кв. 1', required: true },
            { id: 'project.area', label: 'Площадь, м²', type: 'number', placeholder: '72.4', required: true },
            { id: 'project.exploitation_mode', label: 'Режим эксплуатации', type: 'radio', options: [{ value: 'personal', label: 'Для себя' }, { value: 'rent', label: 'Под аренду' }, { value: 'mixed', label: 'Смешанный' }], required: true },
        ]
    },
     {
        id: 'room_configuration',
        title: '2. Конфигурация помещений',
        description: 'Укажите состав и количество помещений в вашем проекте. Анкета автоматически адаптируется.',
        fields: [
            { id: 'room_config.kitchen', label: 'Кухня (отдельная)', type: 'room-toggle-counter', roomType: 'kitchen' },
            { id: 'room_config.kitchen_living', label: 'Кухня-гостиная', type: 'room-toggle-counter', roomType: 'kitchen_living' },
            { id: 'room_config.living_room', label: 'Гостиная (отдельная)', type: 'room-toggle-counter', roomType: 'living_room' },
            { id: 'room_config.hallway', label: 'Прихожая / Холл', type: 'room-toggle-counter', roomType: 'hallway' },
            { id: 'room_config.laundry', label: 'Постирочная', type: 'room-toggle-counter', roomType: 'laundry' },
            { id: 'room_config.pantry', label: 'Кладовая', type: 'room-toggle-counter', roomType: 'pantry' },
            { id: 'room_config.bedrooms', label: 'Спальни', type: 'room-toggle-counter', roomType: 'bedrooms' },
            { id: 'room_config.child_rooms', label: 'Детские', type: 'room-toggle-counter', roomType: 'child_rooms' },
            { id: 'room_config.offices', label: 'Кабинеты', type: 'room-toggle-counter', roomType: 'offices' },
            { id: 'room_config.bathrooms', label: 'Санузлы', type: 'room-toggle-counter', roomType: 'bathrooms' },
            { id: 'room_config.wardrobes', label: 'Гардеробные', type: 'room-toggle-counter', roomType: 'wardrobes' },
            { id: 'room_config.balconies', label: 'Балконы/лоджии', type: 'room-toggle-counter', roomType: 'balconies' },
        ]
    },
    {
        id: 'style',
        title: '3. Стилистика и референсы',
        fields: [
            { 
                id: 'style.styles', 
                label: 'Предпочитаемые стили (не более 3)', 
                type: 'visual-multi', 
                options: [
                    { value: 'minimalism', label: 'Минимализм', image: styleImages.minimalism, deepDive: { keyElements: 'Простые формы, отсутствие лишнего декора, встроенная мебель, монохромные цвета.', palette: 'Белый, серый, черный, графитовые оттенки. Редкие акценты чистого цвета.', lighting: 'Скрытые подсветки, простые геометрические светильники, много естественного света.' }},
                    { value: 'scandinavian', label: 'Скандинавский', image: styleImages.scandinavian, deepDive: { keyElements: 'Светлое дерево, натуральные ткани (лен, хлопок), простые функциональные формы, уютный текстиль (хюгге).', palette: 'Белый, светло-серый, пастельные тона, натуральные оттенки дерева.', lighting: 'Много источников света, простые лампы, свечи, торшеры.' }},
                    { value: 'loft', label: 'Лофт', image: styleImages.loft, deepDive: { keyElements: 'Открытая кирпичная кладка, бетон, металл, видимые коммуникации (трубы, проводка), большие открытые пространства.', palette: 'Терракотовый, серый, черный, металлические оттенки, глубокие насыщенные цвета для акцентов.', lighting: 'Трековые системы, крупные промышленные светильники, лампы Эдисона.' }},
                    { value: 'classic', label: 'Классика', image: styleImages.classic, deepDive: { keyElements: 'Лепнина, молдинги, натуральное дерево, дорогие ткани (бархат, шелк), симметрия, качественная мебель.', palette: 'Бежевые, кремовые, золотые, бордовые, глубокие синие и зеленые тона.', lighting: 'Массивные люстры, бра, настольные лампы с тканевыми абажурами.' }},
                    { value: 'japandi', label: 'Джапанди', image: styleImages.japandi, deepDive: { keyElements: 'Сочетание скандинавского уюта и японского минимализма. Низкая мебель, натуральные материалы, асимметрия, функциональность.', palette: 'Природные, землистые оттенки: бежевый, коричневый, серый, с контрастными черными элементами.', lighting: 'Рассеянный, мягкий свет. Светильники из бумаги, дерева, натуральных тканей.' }},
                    { value: 'eclectic', label: 'Эклектика', image: styleImages.eclectic, deepDive: { keyElements: 'Смешение 2-3 стилей, объединенных общей идеей, цветом или текстурой. Гармоничное сочетание старого и нового.', palette: 'Может быть любой, но обычно используется связующий цвет или группа оттенков для объединения элементов.', lighting: 'Разнообразные светильники из разных эпох и стилей.' }},
                    { value: 'art_deco', label: 'Ар-деко', image: styleImages.art_deco, deepDive: { keyElements: 'Геометрические узоры, глянцевые поверхности, дорогие материалы (латунь, мрамор, бархат), роскошь и шик.', palette: 'Черный, белый, золотой, глубокие насыщенные цвета (изумрудный, сапфировый).', lighting: 'Эффектные люстры, геометрические светильники, много отражающих поверхностей.' }},
                    { value: 'mid_century', label: 'Мид-сенчури', image: styleImages.mid_century, deepDive: { keyElements: 'Функциональная мебель на тонких ножках, натуральное дерево (особенно тик), органические формы, яркие цветовые акценты.', palette: 'Приглушенные природные тона (оранжевый, горчичный, оливковый) в сочетании с деревом.', lighting: 'Иконические светильники с плафонами-сферами, "пауки", торшеры.' }},
                    { value: 'boho', label: 'Бохо', image: styleImages.boho, deepDive: { keyElements: 'Многослойный текстиль (ковры, подушки), плетеные элементы (макраме, ротанг), живые растения, винтажные находки.', palette: 'Теплые, землистые тона, натуральные оттенки с яркими вкраплениями.', lighting: 'Абажуры из натуральных материалов, гирлянды, фонарики.' }},
                    { value: 'contemporary', label: 'Контемпорари', image: styleImages.contemporary, deepDive: { keyElements: 'Простые, чистые линии, нейтральная палитра, акцент на форме и текстуре, а не на декоре. Открытые пространства.', palette: 'Нейтральные оттенки (серый, бежевый, белый) с яркими цветовыми акцентами в искусстве или декоре.', lighting: 'Встроенные системы освещения, треки, скульптурные светильники.' }},
                    { value: 'coastal', label: 'Прибрежный', image: styleImages.coastal, deepDive: { keyElements: 'Светлые, воздушные пространства, натуральные материалы (выбеленное дерево, лен), морская тематика в декоре.', palette: 'Белый, оттенки синего и голубого, песочный, бирюзовый.', lighting: 'Простые светильники, много естественного света.' }},
                    { value: 'french_country', label: 'Французский кантри', image: styleImages.french_country, deepDive: { keyElements: 'Изящная, слегка состаренная мебель, натуральные ткани с цветочным или полосатым принтом, кованые элементы.', palette: 'Пастельные, приглушенные тона: лавандовый, кремовый, светло-желтый, голубой.', lighting: 'Кованые люстры, тканевые абажуры, настольные лампы.' }}
                ],
                required: true
            },
             { 
                id: 'style.palettes', 
                label: 'Предпочитаемая цветовая палитра (не более 3)', 
                type: 'visual-multi',
                options: [
                    { value: 'header1', label: 'Палитры по восприятию', isHeader: true },
                    { value: 'neutral', label: 'Нейтральная', image: paletteImages.neutral, deepDive: { description: 'Белый, светло-бежевый, серо-голубой, графитовый, тёплый серый. Используется как спокойный фон, подчёркивает архитектуру.' } },
                    { value: 'pastel', label: 'Пастельная', image: paletteImages.pastel, deepDive: { description: 'Пудровый розовый, мятный, нежно-лавандовый, небесно-голубой, кремовый. Создаёт мягкость, воздушность, уют.' } },
                    { value: 'natural', label: 'Природная', image: paletteImages.natural, deepDive: { description: 'Терракота, охра, глубокий зелёный, древесный коричневый, песочный. Ассоциация с природой, устойчивостью, натуральностью.' } },
                    { value: 'accent', label: 'Акцентная', image: paletteImages.accent, deepDive: { description: 'Фон: бежево-серый, белый. Акцент: изумруд, сапфир, солнечно-жёлтый, бордовый. Баланс спокойного и динамичного.' } },
                    { value: 'achromatic', label: 'Ахроматическая', image: paletteImages.achromatic, deepDive: { description: 'Белый, чёрный, все оттенки серого. Для минимализма, хай-тека, строгих интерьеров.' } },
                    { value: 'header2', label: 'Подборка 2025 года', isHeader: true },
                    { value: 'new_earth', label: 'Новая земля', image: paletteImages.new_earth, deepDive: { combination: 'Тёплый бежевый + терракота + мягкий оливковый + графит.', mood: 'Эко-минимализм, устойчивость, локальные материалы.' } },
                    { value: 'lavender_dawn', label: 'Лавандовый рассвет', image: paletteImages.lavender_dawn, deepDive: { combination: 'Лавандовый серо-фиолетовый + пыльно-голубой + бежевый крем + матовый чёрный.', mood: 'Спокойная утонченность с современным акцентом.' } },
                    { value: 'futuro_pastel', label: 'Футуро-пастель', image: paletteImages.futuro_pastel, deepDive: { combination: 'Мягкий аквамарин + пастельный лимон + светлый серый + белый.', mood: 'Лёгкий футуризм, тренд на светлые технологичные интерьеры.' } },
                    { value: 'red_wine', label: 'Красное вино', image: paletteImages.red_wine, deepDive: { combination: 'Глубокий бордовый + серый-беж + бронза + молочный.', mood: 'Элегантность, отсылка к арт-деко и роскоши.' } },
                    { value: 'northern_lights', label: 'Северное сияние', image: paletteImages.northern_lights, deepDive: { combination: 'Глубокий изумруд + тёмный синий + холодный серый + серебристый акцент.', mood: 'Атмосфера спокойной драмы, хорошо для современных гостиных и кабинетов.' } },
                ]
            },
            {
                id: 'style.palette_notes',
                label: 'Дополнительные пожелания по цветам (или цвета, которые нужно исключить)',
                type: 'textarea',
                placeholder: 'Например: основной цвет - слоновая кость, акценты - оливковый. Исключить розовый.'
            },
            { id: 'style.materials', label: 'Ключевые материалы (топ-3)', type: 'multi-enum', options: [
                { value: 'wood', label: 'Дерево', info: 'Натуральное дерево и его имитации. Придает тепло и уют. Используется в мебели, напольных покрытиях, стеновых панелях.' }, 
                { value: 'stone', label: 'Камень/керамогранит', info: 'Натуральный камень (мрамор, гранит) или его практичный аналог - керамогранит. Прочный, долговечный, идеален для влажных зон и полов.' }, 
                { value: 'paint', label: 'Краска', info: 'Позволяет добиться любого цвета, легко обновляется. Современные краски износостойки и экологичны.' }, 
                { value: 'textile', label: 'Текстиль', info: 'Шторы, обивка мебели, ковры. Создает уют, добавляет фактуру и цвет.' }, 
                { value: 'metal', label: 'Металл', info: 'Латунь, хром, черненый металл. Используется в светильниках, фурнитуре, декоре. Добавляет графичности и акцентов.' }, 
                { value: 'glass', label: 'Стекло', info: 'Прозрачное, матовое, рифленое. Используется в перегородках, дверях, мебели. Помогает зонировать пространство, сохраняя свет.' }
            ] },
            { id: 'style.references', label: 'Ссылки на понравившиеся интерьеры (Pinterest, Houzz и т.д.)', type: 'textarea' },
            { id: 'style.references_files', label: 'Приложите референсы (moodboard, картинки)', type: 'file', info: 'После загрузки изображения появится кнопка «Редактировать», которая откроет интерактивный редактор для добавления пометок.' },
        ]
    },
    {
        id: 'client_household',
        title: '4. Заказчик и состав семьи',
        description: 'Информация о вас и тех, кто будет жить в квартире.',
        fields: [
            { id: 'client.name', label: 'ФИО контактного лица', type: 'text', placeholder: 'Иванов Иван Иванович', required: true },
            { id: 'client.phone', label: 'Телефон', type: 'tel', placeholder: '+7 (999) 123-45-67', required: true },
            { id: 'client.email', label: 'Email', type: 'email', placeholder: 'example@email.com' },
            { 
                id: 'client.messenger', 
                label: 'Предпочитаемый мессенджер', 
                type: 'multi-enum', 
                options: [
                    { value: 'telegram', label: 'Telegram' },
                    { value: 'whatsapp', label: 'WhatsApp' },
                    { value: 'viber', label: 'Viber' },
                    { value: 'phone_call', label: 'Телефонный звонок' },
                ] 
            },
            { id: 'client.data_consent', label: 'Я согласен(а) на обработку персональных данных', type: 'checkbox', required: true, validation_error_message: "Необходимо ваше согласие на обработку данных для продолжения" },
            { id: 'household.members', label: 'Состав семьи', type: 'multi-text', info: 'Укажите всех, кто будет проживать: взрослые, дети (возраст), пожилые, питомцы (вид). Пример: 2 взрослых, 1 ребенок (5 лет), кошка.', required: true },
        ]
    },
    {
        id: 'goals',
        title: '5. Цели, приоритеты и ограничения',
        fields: [
            { id: 'goals.top_3_tasks', label: 'Топ-3 главные задачи проекта', type: 'multi-enum', options: [{value: 'storage', label: 'Увеличить кол-во мест хранения'}, {value: 'lighting', label: 'Продумать сценарии освещения'}, {value: 'replanning', label: 'Сделать перепланировку'}, {value: 'zoning', label: 'Создать функциональные зоны'}, {value: 'soundproofing', label: 'Улучшить шумоизоляцию'}, {value: 'home_office', label: 'Организовать рабочее место'}, {value: 'kids_room', label: 'Спроектировать детскую'}, {value: 'smart_home', label: 'Интегрировать умный дом'}], required: true },
            { id: 'goals.success_criteria', label: 'Что для вас будет критерием успеха проекта?', type: 'textarea', placeholder: 'Например: "Квартира стала уютнее и функциональнее, у каждого появилось свое пространство"' },
            { id: 'goals.constraints', label: 'Есть ли известные ограничения?', type: 'textarea', placeholder: 'Например: сроки, строгие правила ТСЖ, нормы БТИ, особенности от застройщика', info: "Любые юридические, технические или финансовые рамки, которые могут повлиять на проект. Чем подробнее вы их опишете сейчас, тем точнее будет проектное решение." }
        ]
    },
    {
        id: 'budget',
        title: '6. Бюджет и сроки',
        fields: [
            { 
                id: 'budget.range', 
                label: 'Ориентировочный бюджет на отделку и материалы', 
                type: 'enum', 
                options: [ 
                    {value: 'up_to_2m', label: 'до 2 млн ₽', info: 'Подходит для качественного косметического ремонта с использованием доступных, но проверенных материалов (например, ламинат, краска, стандартная плитка).'}, 
                    {value: '2_4m', label: '2-4 млн ₽', info: 'Позволяет реализовать большинство стандартных решений, включая частичную замену инженерии и использование материалов среднего ценового сегмента (например, инженерная доска, качественный керамогранит).'}, 
                    {value: '4_7m', label: '4-7 млн ₽', info: 'Комфортный бюджет для комплексного проекта с перепланировкой, полной заменой инженерии и использованием высококачественных материалов (например, паркет, крупноформатный керамогранит, заказные элементы).'}, 
                    {value: '7m_plus', label: 'более 7 млн ₽', info: 'Бюджет для проектов премиум-класса с использованием эксклюзивных материалов, заказных позиций, сложных технических решений (умный дом, канальное кондиционирование) и мебели от известных брендов.'}, 
                    {value: 'custom', label: 'Указать свой'} 
                ]
            },
            { id: 'budget.custom_amount', label: 'Свой бюджет, ₽', type: 'number', required: true, condition: (data: IFormData) => data.budget.range === 'custom'},
            { id: 'budget.include_furniture_tech', label: 'Техника и мебель включены в этот бюджет?', type: 'radio', options: [{value: 'yes', label: 'Да'}, {value: 'no', label: 'Нет'}]},
            { id: 'budget.deadline', label: 'Желаемый срок изготовления проекта', type: 'date' },
            { id: 'budget.pace', label: 'Темп проекта', type: 'radio', options: [{value: 'normal', label: 'Стандартный'}, {value: 'asap', label: 'Ускоренный (если возможно)'}]},
        ]
    },
    {
        id: 'replanning',
        title: '7. Перепланировка',
        fields: [
            { id: 'replanning.needed', label: 'Требуется ли перепланировка?', type: 'radio', options: [{value: 'yes', label: 'Да'}, {value: 'no', 'label': 'Нет'}], required: true },
            { id: 'replanning.bti_plan', label: 'Приложите план БТИ или схему от застройщика', type: 'file', condition: (data: IFormData) => data.replanning.needed === 'yes', info: 'После загрузки изображения появится кнопка «Редактировать», которая откроет интерактивный редактор для добавления пометок.'},
            { id: 'replanning.constraints', label: 'Известные ограничения по перепланировке', type: 'multi-enum', options: [
                { value: 'bearing_walls', label: 'Несущие стены', info: "Основные стены здания, снос или изменение которых требует сложного согласования и конструкторского расчета. Обычно обозначены на плане БТИ толстыми линиями." }, 
                { value: 'wet_zones', label: 'Мокрые зоны', info: "Зоны санузлов и кухни. Расширять их можно только за счет нежилых помещений (коридор, кладовая). Переносить в жилые комнаты запрещено." }, 
                { value: 'gas', label: 'Газ', info: "Наличие газа накладывает строгие ограничения. Например, кухню с газовой плитой нельзя объединять с жилой комнатой без установки плотно закрывающейся двери." }
            ] },
        ]
    },
    {
        id: 'ventilation',
        title: '8. Вентиляция',
        fields: [
            {
                id: 'ventilation.kitchen_hood_type',
                label: 'Тип вытяжки на кухне',
                type: 'enum',
                options: [
                    { value: 'none', label: 'Не требуется' },
                    { value: 'recirculation', label: 'Рециркуляционная (угольный фильтр)', info: 'Простой монтаж, не требует вентканала. Фильтрует воздух и возвращает в помещение. Требует периодической замены фильтров.' },
                    { value: 'extraction', label: 'Вытяжная (в вентиляцию)', info: 'Наиболее эффективный способ удаления запахов и пара. Требует подключения к общедомовой вентиляции.' },
                    { value: 'downdraft', label: 'Встроенная в столешницу', info: 'Современное и эстетичное решение, выезжает из столешницы. Эффективна, но требует места и сложнее в монтаже.' },
                ]
            },
            {
                id: 'ventilation.bathroom_fan_type',
                label: 'Вытяжка в санузле',
                type: 'enum',
                options: [
                    { value: 'natural', label: 'Естественная (через вентканал)' },
                    { value: 'forced_basic', label: 'Принудительная (стандартный вентилятор)', info: 'Включается вместе со светом или отдельным выключателем. Эффективно удаляет влагу.' },
                    { value: 'forced_timer', label: 'Принудительная (с таймером/датчиком влажности)', info: 'Автоматически включается при повышении влажности или работает некоторое время после выключения света, обеспечивая полное проветривание.' },
                ]
            },
            {
                id: 'ventilation.additional_ventilation_notes',
                label: 'Требуется ли дополнительная вентиляция?',
                type: 'textarea',
                placeholder: 'Например: приточный клапан в спальне, вытяжка в гардеробной или кладовой.'
            }
        ]
    },
    {
        id: 'electrics_general',
        title: '9. Общая электрика',
        fields: [
            { id: 'electrics_general.panel_notes', label: 'Пожелания к электрощиту (автоматика, УЗО)', type: 'text', placeholder: 'Например: раздельные группы на каждого потребителя, реле напряжения', info: 'Современный щит — залог безопасности. Рекомендуется установка УЗО (защита от утечки тока) на все влажные зоны и детские, а также реле контроля напряжения для защиты техники от скачков в сети.' },
            { id: 'electrics_general.electrics_plan', label: 'Приложите план или схему расположения розеток', type: 'file', info: 'После загрузки изображения появится кнопка «Редактировать» для визуального планирования электрики.' }
        ]
    },
    {
        id: 'additional',
        title: '10. Особые пожелания',
        fields: [
            { id: 'additional.safety_notes', label: 'Пожелания по безопасности (дети, питомцы, аллергии)', type: 'textarea' },
            { id: 'additional.wishes_taboos', label: 'Другие важные пожелания или абсолютные табу', type: 'textarea' },
        ]
    },
];