import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('Start seeding...')

  // Seed Villages
  const villages = [
    { name: 'Ускут', originalName: 'Ускут (Приветное)', district: 'Алуштинский', population: 1200, lat: 44.85, lng: 34.55, description: 'Историческое крымскотатарское село на южном берегу Крыма' },
    { name: 'Кучук-Узень', originalName: 'Кучук-Узень', district: 'Судакский', population: 800, lat: 44.92, lng: 34.98, description: 'Древнее село с богатой историей' },
    { name: 'Коккозы', originalName: 'Коккозы', district: 'Бахчисарайский', population: 2500, lat: 44.75, lng: 33.85, description: 'Крупное крымскотатарское село' },
    { name: 'Бахчисарай', originalName: 'Бахчисарай', district: 'Бахчисарайский', population: 27000, lat: 44.75, lng: 33.85, description: 'Историческая столица Крымского ханства' },
    { name: 'Старый Крым', originalName: 'Эски Къырым', district: 'Кировский', population: 4200, lat: 45.03, lng: 35.10, description: 'Древний город с богатой историей' },
    { name: 'Белогорск', originalName: 'Карасубазар', district: 'Белогорский', population: 18000, lat: 45.05, lng: 34.60, description: 'Исторический торговый город' },
  ]

  for (const village of villages) {
    await prisma.village.upsert({
      where: { name: village.name },
      update: {},
      create: village,
    })
  }
  console.log('Villages seeded')

  // Seed Calendar Events
  const events = [
    { day: '18', month: 'МАЙ', monthNumber: 5, title: 'День памяти жертв депортации', description: 'Общегородской молебен и мероприятия. В этот день в 1944 году началась депортация крымских татар из Крыма.', category: 'MEMORIAL' },
    { day: '21', month: 'МАРТ', monthNumber: 3, title: 'Наврез', description: 'Древний праздник земледельцев, начало весны и сельскохозяйственных работ.', category: 'NATIONAL' },
    { day: '6', month: 'МАЙ', monthNumber: 5, title: 'Хыдырлез', description: 'Народный праздник, начало полевых работ. Прыжки через костер, борьба куреш.', category: 'NATIONAL' },
    { day: '22', month: 'СЕНТ', monthNumber: 9, title: 'Дервиза', description: 'Праздник урожая, окончание сельскохозяйственного года. Жертвоприношение барана.', category: 'NATIONAL' },
    { day: '22', month: 'ДЕК', monthNumber: 12, title: 'Йыл Геджеси', description: 'Крымскотатарский Новый год. Пироги с мясом и рисом, колядование.', category: 'NATIONAL' },
    { day: '1', month: 'МАЙ', monthNumber: 5, title: 'Рамазан', description: 'Начало священного месяца поста. Соблюдение поста от рассвета до заката.', category: 'RELIGIOUS' },
  ]

  for (const event of events) {
    await prisma.calendarEvent.upsert({
      where: { 
        id: event.title 
      },
      update: {},
      create: event as any,
    })
  }
  console.log('Calendar events seeded')

  // Seed Rituals
  const djenaze = await prisma.ritual.upsert({
    where: { id: 'djenaze' },
    update: {},
    create: {
      id: 'djenaze',
      name: 'Дженазе',
      originalName: 'Дженазе',
      category: 'FUNERAL',
      icon: '🕌',
      description: 'Похороны по исламским канонам и крымскотатарским традициям',
    },
  })

  const djenazeSteps = [
    { title: '1. Смывание усопшего', description: 'Тело усопшего омывается специальными людьми (гассал) три раза: с водой и листьями лотоса, затем с водой и соком лимона, и наконец с чистой водой.' },
    { title: '2. Кафан', description: 'Тело заворачивается в три белых хлопчатобумажных савана (кафан). Мужчин кладут в кафан так, чтобы голова была направлена на юг, женщин - на север.' },
    { title: '3. Намаз-э дженазе', description: 'Специальный похоронный намаз, который совершается стоя. Имам читает молитву за усопшего, прося Всевышнего простить его грехи.' },
    { title: '4. Похоронная процессия', description: 'Тело на носилках (табут) доставляется на кладбище. Мужчины несут табут на плечах, женщины следуют позади. По пути читается такбир.' },
    { title: '5. Погребение', description: 'Могила копается так, чтобы усопший лежал на правом боку, лицом в сторону Каабы (на запад). Тело опускается в могилу без гроба, кафан не снимается.' },
    { title: '6. Телкин', description: 'После закапывания имам или близкий родственник произносит слова напоминания о смерти и загробной жизни, обращаясь к усопшему.' },
    { title: '7. Поминальный обед', description: 'На 3-й, 7-й, 40-й и 52-й дни после смерти устраиваются поминки (той). Родственники читают Коран и раздают садака (милостыню) бедным.' },
  ]

  for (let i = 0; i < djenazeSteps.length; i++) {
    await prisma.ritualStep.upsert({
      where: { id: `djenaze-step-${i}` },
      update: {},
      create: {
        id: `djenaze-step-${i}`,
        ritualId: djenaze.id,
        order: i,
        title: djenazeSteps[i].title,
        description: djenazeSteps[i].description,
      },
    })
  }

  const nikyah = await prisma.ritual.upsert({
    where: { id: 'nikyah' },
    update: {},
    create: {
      id: 'nikyah',
      name: 'Никях',
      originalName: 'Никях',
      category: 'WEDDING',
      icon: '💍',
      description: 'Бракосочетание по исламским канонам и крымскотатарским традициям',
    },
  })

  const nikyahSteps = [
    { title: '1. Сёз кесим (Сватовство)', description: 'Родители жениха направляют сватов (къудалар) в дом невесты. Обсуждается дата свадьбы, девушке преподносится подарок - нишан.' },
    { title: '2. Пенджереге бармакъ', description: 'После помолвки жених может приходить к окошку невесты, дарить ей подарки. Это означает, что молодые теперь могут встречаться как жених и невеста.' },
    { title: '3. Агъыр нишан (Помолвка)', description: 'За 2-3 недели до свадьбы заключается окончательный договор, освящаемый молитвой. Происходит обмен подарками между семьями.' },
    { title: '4. Хына геджеси (Ночь хны)', description: 'Накануне свадьбы невеста проводит ночь в кругу родных и подруг. Ей красят хной кончики пальцев - это символ достатка (берекет).' },
    { title: '5. Тыраш акъшамы (Вечер бритья)', description: 'Вечером жених собирает друзей, парикмахер торжественно сбривает ему бороду под веселые песни. Это символизирует прощание с холостяцкой жизнью.' },
    { title: '6. Никях (Венчание)', description: 'Мулла трижды спрашивает невесту о согласии выйти замуж. После положительного ответа объявляет о заключении брака. Жених также дает свое согласие.' },
    { title: '7. Проводы невесты', description: 'Невеста прощается с родителями, целуя им руки. Отец опоясывает ее серебряным поясом (кушак). Младший брат несет Коран перед процессией.' },
    { title: '8. Встреча у жениха', description: 'У ворот дома жениха процессию встречают музыкантами. Мать жениха посыпает невесту пшеницей, сладостями и монетами.' },
  ]

  for (let i = 0; i < nikyahSteps.length; i++) {
    await prisma.ritualStep.upsert({
      where: { id: `nikyah-step-${i}` },
      update: {},
      create: {
        id: `nikyah-step-${i}`,
        ritualId: nikyah.id,
        order: i,
        title: nikyahSteps[i].title,
        description: nikyahSteps[i].description,
      },
    })
  }

  console.log('Rituals seeded')

  // Seed Meetings
  const meetings = [
    {
      village: 'с. Ускут (Приветное)',
      villageOriginal: 'Ускут',
      dateString: '15 ИЮНЯ',
      organizer: 'Совет старейшин',
      location: 'Поляна "Кок-Асан"',
      description: 'Традиционная встреча жителей села Ускут',
      fundraisingTitle: 'Сбор на реставрацию чешме:',
      fundraisingCurrent: 65,
      fundraisingTarget: 100,
    },
    {
      village: 'с. Коккозы',
      villageOriginal: 'Коккозы',
      dateString: '22 ИЮНЯ',
      organizer: 'Джемаат',
      location: 'Старинная мечеть',
      description: 'Встреча жителей села Коккозы',
      fundraisingTitle: 'Сбор на ремонт дороги:',
      fundraisingCurrent: 42,
      fundraisingTarget: 100,
    },
    {
      village: 'с. Бахчисарай',
      villageOriginal: 'Бахчисарай',
      dateString: '29 ИЮНЯ',
      organizer: 'Меджлис',
      location: 'Дворцовая площадь',
      description: 'Общегородское собрание',
    },
    {
      village: 'с. Кучук-Узень',
      villageOriginal: 'Кучук-Узень',
      dateString: 'УТОЧНЯЕТСЯ',
      organizer: 'Оргкомитет',
      location: 'Центральная площадь',
      description: 'Дата встречи уточняется оргкомитетом',
    },
  ]

  for (const meeting of meetings) {
    await prisma.meeting.upsert({
      where: { id: meeting.village },
      update: {},
      create: {
        id: meeting.village,
        ...meeting,
        status: 'ACTIVE',
        createdBy: 'system',
      } as any,
    })
  }
  console.log('Meetings seeded')

  // Seed Emergency Helps
  const emergencies = [
    {
      type: 'BLOOD',
      urgency: 'CRITICAL',
      title: 'СРОЧНО: КРОВЬ 4-',
      location: 'Симферополь, Центр Крови',
      description: 'Для Ибраимова Эскендера. Просим отозваться доноров.',
      bloodType: '4-',
      contactName: 'Ибраимов Эскендер',
    },
    {
      type: 'MONEY',
      urgency: 'HIGH',
      title: 'Помощь семье с детьми',
      location: 'Бахчисарайский район',
      description: 'Семья с 4 детьми осталась без крова после пожара.',
    },
    {
      type: 'VOLUNTEER',
      urgency: 'MEDIUM',
      title: 'Нужен доброволец',
      location: 'Евпатория',
      description: 'Помощь пожилому человеку по дому.',
    },
  ]

  for (const emergency of emergencies) {
    await prisma.emergencyHelp.upsert({
      where: { id: emergency.title },
      update: {},
      create: {
        id: emergency.title,
        ...emergency,
        status: 'ACTIVE',
        createdBy: 'system',
      } as any,
    })
  }
  console.log('Emergency helps seeded')

  console.log('Seeding finished')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
