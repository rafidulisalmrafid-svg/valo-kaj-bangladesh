export interface DistrictData {
    name: string;
    name_bn: string;
    division: string;
    deeds: number;
    heroes: number;
    impact: number;
    lat: number;
    lng: number;
    topHero: string;
}

export const DIVISIONS = [
    { name: 'Dhaka', name_bn: 'ঢাকা', count: 13, heroes: 2140, deeds: 12480 },
    { name: 'Chattogram', name_bn: 'চট্টগ্রাম', count: 11, heroes: 1680, deeds: 9820 },
    { name: 'Rajshahi', name_bn: 'রাজশাহী', count: 8, heroes: 940, deeds: 5410 },
    { name: 'Khulna', name_bn: 'খুলনা', count: 10, heroes: 812, deeds: 4890 },
    { name: 'Barishal', name_bn: 'বরিশাল', count: 6, heroes: 540, deeds: 3210 },
    { name: 'Sylhet', name_bn: 'সিলেট', count: 4, heroes: 1210, deeds: 6740 },
    { name: 'Rangpur', name_bn: 'রংপুর', count: 8, heroes: 690, deeds: 4020 },
    { name: 'Mymensingh', name_bn: 'ময়মনসিংহ', count: 4, heroes: 470, deeds: 2860 },
];

export const DISTRICTS: DistrictData[] = [
    // Sylhet Division
    { name: 'Sylhet', name_bn: 'সিলেট', division: 'Sylhet', deeds: 2840, heroes: 520, impact: 198400, lat: 24.8949, lng: 91.8687, topHero: 'Rashida Akter' },
    { name: 'Moulvibazar', name_bn: 'মৌলভীবাজার', division: 'Sylhet', deeds: 1420, heroes: 240, impact: 94200, lat: 24.4829, lng: 91.7774, topHero: 'Kamrul Islam' },
    { name: 'Habiganj', name_bn: 'হবিগঞ্জ', division: 'Sylhet', deeds: 1280, heroes: 210, impact: 86100, lat: 24.3749, lng: 91.4155, topHero: 'Farid Mia' },
    { name: 'Sunamganj', name_bn: 'সুনামগঞ্জ', division: 'Sylhet', deeds: 1200, heroes: 240, impact: 81200, lat: 25.0658, lng: 91.3950, topHero: 'Abdul Haque' },

    // Dhaka Division
    { name: 'Dhaka', name_bn: 'ঢাকা', division: 'Dhaka', deeds: 6840, heroes: 1250, impact: 294000, lat: 23.8103, lng: 90.4125, topHero: 'Dhaka Youth Club' },
    { name: 'Gazipur', name_bn: 'গাজীপুর', division: 'Dhaka', deeds: 980, heroes: 180, impact: 64200, lat: 23.9999, lng: 90.4203, topHero: 'Shakil Ahmed' },
    { name: 'Narayanganj', name_bn: 'নারায়ণগঞ্জ', division: 'Dhaka', deeds: 1120, heroes: 210, impact: 72100, lat: 23.6337, lng: 90.4965, topHero: 'Ripon Mia' },
    { name: 'Tangail', name_bn: 'টাঙ্গাইল', division: 'Dhaka', deeds: 840, heroes: 140, impact: 52300, lat: 24.2513, lng: 89.9167, topHero: 'Salma Khatun' },
    { name: 'Faridpur', name_bn: 'ফরিদপুর', division: 'Dhaka', deeds: 620, heroes: 98, impact: 41200, lat: 23.6071, lng: 89.8429, topHero: 'Asaduzzaman' },
    { name: 'Manikganj', name_bn: 'মানিকগঞ্জ', division: 'Dhaka', deeds: 540, heroes: 82, impact: 36400, lat: 23.8617, lng: 90.0003, topHero: 'Fahim Reza' },
    { name: 'Munshiganj', name_bn: 'মুন্সীগঞ্জ', division: 'Dhaka', deeds: 510, heroes: 74, impact: 32900, lat: 23.5422, lng: 90.5305, topHero: 'Habibullah' },
    { name: 'Narsingdi', name_bn: 'নরসিংদী', division: 'Dhaka', deeds: 710, heroes: 110, impact: 46800, lat: 23.9322, lng: 90.7154, topHero: 'Sultana Razia' },
    { name: 'Gopalganj', name_bn: 'গোপালগঞ্জ', division: 'Dhaka', deeds: 480, heroes: 68, impact: 31200, lat: 23.0051, lng: 89.8266, topHero: 'Monir Hossain' },
    { name: 'Madaripur', name_bn: 'মাদারীপুর', division: 'Dhaka', deeds: 420, heroes: 56, impact: 28400, lat: 23.1641, lng: 90.1897, topHero: 'Shahadat' },
    { name: 'Rajbari', name_bn: 'রাজবাড়ী', division: 'Dhaka', deeds: 390, heroes: 52, impact: 25100, lat: 23.7574, lng: 89.6445, topHero: 'Delwar' },
    { name: 'Shariatpur', name_bn: 'শরীয়তপুর', division: 'Dhaka', deeds: 360, heroes: 48, impact: 23400, lat: 23.2423, lng: 90.4348, topHero: 'Rubel' },
    { name: 'Kishoreganj', name_bn: 'কিশোরগঞ্জ', division: 'Dhaka', deeds: 620, heroes: 92, impact: 39800, lat: 24.4449, lng: 90.7766, topHero: 'Aminul' },

    // Chattogram Division
    { name: 'Chattogram', name_bn: 'চট্টগ্রাম', division: 'Chattogram', deeds: 4200, heroes: 740, impact: 184000, lat: 22.3569, lng: 91.7832, topHero: 'Karim Hossain' },
    { name: "Cox's Bazar", name_bn: 'কক্সবাজার', division: 'Chattogram', deeds: 1480, heroes: 280, impact: 98400, lat: 21.4272, lng: 92.0058, topHero: 'Tareq Aziz' },
    { name: 'Cumilla', name_bn: 'কুমিল্লা', division: 'Chattogram', deeds: 1380, heroes: 230, impact: 88200, lat: 23.4682, lng: 91.1788, topHero: 'Saiful Islam' },
    { name: 'Feni', name_bn: 'ফেনী', division: 'Chattogram', deeds: 940, heroes: 160, impact: 61000, lat: 23.0186, lng: 91.3966, topHero: 'Zahid Hasan' },
    { name: 'Noakhali', name_bn: 'নোয়াখালী', division: 'Chattogram', deeds: 880, heroes: 145, impact: 58200, lat: 22.8696, lng: 91.0994, topHero: 'Abul Kalam' },
    { name: 'Brahmanbaria', name_bn: 'ব্রাহ্মণবাড়িয়া', division: 'Chattogram', deeds: 790, heroes: 130, impact: 52100, lat: 23.9571, lng: 91.1119, topHero: 'Nurul Islam' },
    { name: 'Chandpur', name_bn: 'চাঁদপুর', division: 'Chattogram', deeds: 710, heroes: 115, impact: 46200, lat: 23.2321, lng: 90.6631, topHero: 'Jashim' },
    { name: 'Lakshmipur', name_bn: 'লক্ষ্মীপুর', division: 'Chattogram', deeds: 520, heroes: 84, impact: 34100, lat: 22.9425, lng: 90.8412, topHero: 'Selim' },
    { name: 'Rangamati', name_bn: 'রাঙ্গামাটি', division: 'Chattogram', deeds: 420, heroes: 68, impact: 29400, lat: 22.6533, lng: 92.1753, topHero: 'Ching Mong' },
    { name: 'Bandarban', name_bn: 'বান্দরবান', division: 'Chattogram', deeds: 380, heroes: 59, impact: 26800, lat: 22.1953, lng: 92.2184, topHero: 'Sing U Nu' },
    { name: 'Khagrachhari', name_bn: 'খাগড়াছড়ি', division: 'Chattogram', deeds: 350, heroes: 54, impact: 24200, lat: 23.1193, lng: 91.9847, topHero: 'Pranab Chakma' },

    // Rangpur Division
    { name: 'Rangpur', name_bn: 'রংপুর', division: 'Rangpur', deeds: 1420, heroes: 230, impact: 91200, lat: 25.7439, lng: 89.2752, topHero: 'Nusrat Jahan' },
    { name: 'Dinajpur', name_bn: 'দিনাজপুর', division: 'Rangpur', deeds: 980, heroes: 160, impact: 64100, lat: 25.6217, lng: 88.6355, topHero: 'Enamul Haque' },
    { name: 'Kurigram', name_bn: 'কুড়িগ্রাম', division: 'Rangpur', deeds: 680, heroes: 110, impact: 44200, lat: 25.8054, lng: 89.6362, topHero: 'Bakul Mia' },
    { name: 'Gaibandha', name_bn: 'গাইবান্ধা', division: 'Rangpur', deeds: 540, heroes: 88, impact: 36100, lat: 25.3288, lng: 89.5430, topHero: 'Shahidul' },
    { name: 'Nilphamari', name_bn: 'নীলফামারী', division: 'Rangpur', deeds: 460, heroes: 76, impact: 31000, lat: 25.9318, lng: 88.8560, topHero: 'Azizul' },
    { name: 'Lalmonirhat', name_bn: 'লালমনিরহাট', division: 'Rangpur', deeds: 390, heroes: 62, impact: 26400, lat: 25.9923, lng: 89.2847, topHero: 'Shamim' },
    { name: 'Panchagarh', name_bn: 'পঞ্চগড়', division: 'Rangpur', deeds: 340, heroes: 54, impact: 23100, lat: 26.3411, lng: 88.5542, topHero: 'Hasan' },
    { name: 'Thakurgaon', name_bn: 'ঠাকুরগাঁও', division: 'Rangpur', deeds: 310, heroes: 48, impact: 21200, lat: 26.0337, lng: 88.4617, topHero: 'Liton' },

    // Khulna Division
    { name: 'Khulna', name_bn: 'খুলনা', division: 'Khulna', deeds: 1840, heroes: 290, impact: 118400, lat: 22.8456, lng: 89.5403, topHero: 'Sabbir Rahman' },
    { name: 'Jashore', name_bn: 'যশোর', division: 'Khulna', deeds: 1120, heroes: 180, impact: 74200, lat: 23.1664, lng: 89.2081, topHero: 'Rana Mia' },
    { name: 'Satkhira', name_bn: 'সাতক্ষীরা', division: 'Khulna', deeds: 840, heroes: 135, impact: 54100, lat: 22.7185, lng: 89.0705, topHero: 'Anisur Rahman' },
    { name: 'Kushtia', name_bn: 'কুষ্টিয়া', division: 'Khulna', deeds: 680, heroes: 110, impact: 44800, lat: 23.9013, lng: 89.1204, topHero: 'Lalon Lovers' },
    { name: 'Bagerhat', name_bn: 'বাগেরহাট', division: 'Khulna', deeds: 580, heroes: 95, impact: 38200, lat: 22.6516, lng: 89.7859, topHero: 'Golam Rabbani' },
    { name: 'Jhenaidah', name_bn: 'ঝিনাইদহ', division: 'Khulna', deeds: 490, heroes: 78, impact: 32100, lat: 23.5450, lng: 89.1726, topHero: 'Kamrul' },
    { name: 'Chuadanga', name_bn: 'চুয়াডাঙ্গা', division: 'Khulna', deeds: 380, heroes: 62, impact: 25400, lat: 23.6402, lng: 88.8418, topHero: 'Masud' },
    { name: 'Magura', name_bn: 'মাগুরা', division: 'Khulna', deeds: 340, heroes: 54, impact: 22800, lat: 23.4873, lng: 89.4198, topHero: 'Alomgir' },
    { name: 'Meherpur', name_bn: 'মেহেরপুর', division: 'Khulna', deeds: 280, heroes: 44, impact: 18900, lat: 23.7622, lng: 88.6318, topHero: 'Babul' },
    { name: 'Narail', name_bn: 'নড়াইল', division: 'Khulna', deeds: 240, heroes: 38, impact: 16200, lat: 23.1725, lng: 89.5127, topHero: 'Mithun' },

    // Rajshahi Division
    { name: 'Rajshahi', name_bn: 'রাজশাহী', division: 'Rajshahi', deeds: 1980, heroes: 320, impact: 129400, lat: 24.3636, lng: 88.6241, topHero: 'Farhana Yeasmin' },
    { name: 'Bogura', name_bn: 'বগুড়া', division: 'Rajshahi', deeds: 1240, heroes: 210, impact: 81200, lat: 24.8465, lng: 89.3777, topHero: 'Mahbub Alam' },
    { name: 'Pabna', name_bn: 'পাবনা', division: 'Rajshahi', deeds: 890, heroes: 145, impact: 58400, lat: 24.0064, lng: 89.2372, topHero: 'Zillur' },
    { name: 'Sirajganj', name_bn: 'সিরাজগঞ্জ', division: 'Rajshahi', deeds: 840, heroes: 135, impact: 54900, lat: 24.4534, lng: 89.7008, topHero: 'Helal' },
    { name: 'Naogaon', name_bn: 'নওগাঁ', division: 'Rajshahi', deeds: 620, heroes: 102, impact: 40800, lat: 24.7936, lng: 88.9318, topHero: 'Jahangir' },
    { name: 'Natore', name_bn: 'নাটোর', division: 'Rajshahi', deeds: 540, heroes: 88, impact: 35400, lat: 24.4206, lng: 88.9324, topHero: 'Sharif' },
    { name: 'Chapai Nawabganj', name_bn: 'চাঁপাইনবাবগঞ্জ', division: 'Rajshahi', deeds: 480, heroes: 78, impact: 31500, lat: 24.5965, lng: 88.2775, topHero: 'Mintu' },
    { name: 'Joypurhat', name_bn: 'জয়পুরহাট', division: 'Rajshahi', deeds: 320, heroes: 52, impact: 21200, lat: 25.1015, lng: 89.0275, topHero: 'Sujon' },

    // Barishal Division
    { name: 'Barishal', name_bn: 'বরিশাল', division: 'Barishal', deeds: 1480, heroes: 230, impact: 94800, lat: 22.7010, lng: 90.3535, topHero: 'Tania Islam' },
    { name: 'Patuakhali', name_bn: 'পটুয়াখালী', division: 'Barishal', deeds: 640, heroes: 105, impact: 42100, lat: 22.3596, lng: 90.3298, topHero: 'Rashedul' },
    { name: 'Bhola', name_bn: 'ভোলা', division: 'Barishal', deeds: 580, heroes: 95, impact: 38200, lat: 22.6859, lng: 90.6481, topHero: 'Iqbal' },
    { name: 'Pirojpur', name_bn: 'পিরোজপুর', division: 'Barishal', deeds: 420, heroes: 68, impact: 27900, lat: 22.5841, lng: 89.9720, topHero: 'Sajal' },
    { name: 'Barguna', name_bn: 'বরগুনা', division: 'Barishal', deeds: 360, heroes: 58, impact: 23800, lat: 22.0953, lng: 90.1121, topHero: 'Nasir' },
    { name: 'Jhalokati', name_bn: 'ঝালকাঠি', division: 'Barishal', deeds: 290, heroes: 46, impact: 19200, lat: 22.6406, lng: 90.1987, topHero: 'Kabir' },

    // Mymensingh Division
    { name: 'Mymensingh', name_bn: 'ময়মনসিংহ', division: 'Mymensingh', deeds: 1640, heroes: 260, impact: 104200, lat: 24.7471, lng: 90.4203, topHero: 'Kamrul Hasan' },
    { name: 'Jamalpur', name_bn: 'জামালপুর', division: 'Mymensingh', deeds: 720, heroes: 115, impact: 47200, lat: 24.9375, lng: 89.9378, topHero: 'Faruk' },
    { name: 'Netrokona', name_bn: 'নেত্রকোণা', division: 'Mymensingh', deeds: 580, heroes: 92, impact: 38100, lat: 24.8709, lng: 90.7279, topHero: 'Dipak' },
    { name: 'Sherpur', name_bn: 'শেরপুর', division: 'Mymensingh', deeds: 420, heroes: 68, impact: 27500, lat: 25.0205, lng: 90.0153, topHero: 'Zahid' },
];
