# Hamiket-Task

## نحوه راه اندازی
برای راه اندازی پروژه ابتدا دیتابیس MySQL خودتون رو روی سیستم ران کرده و سپس می توانید این ریپازیتوری را clone کنید:

`git clone https://github.com/SepehrYahyaee/Hamiket-Task.git`

سپس فایل `env.` خودتان را بسازید تا متغیر های محیطی مورد نیاز را ست کنید:

- `DATABASE_URL = mysql://username:password@localhost:3306/mydb`
- `PORT = 3000 or your desired port`
- `SECRET_KEY = RandomSecretKey`
- `ACCESS_TOKEN_EXPIRE_TIME = 1d`

پس از آنکه فایل env. خود را ساختید با استفاده از دستورات زیر به ترتیب پروژه را می توانید اجرا کنید:

1. `npm install`
2. `npm run db`
3. `npm run test`

برای مشاهده مسیر ها می توانید به `localhost:PORT/api-docs` برای مشاهده ی داکیومنت Swagger رجوع فرمایید. همچنین دیتاهای سمپلی که توسط فایل seeds به دیتابیس وارد خواهند شد به صورت زیر می باشند:

- userName: "Hasan" - password: "12345678"

همچنین یک تسک تستی ساخته شده است:

- name: "New task" - description: "A sample description for this task."

## دیتابیس و مدل ها و Entity ها
دیتابیس درخواستی برای انجام این تسک کوتاه MySQL بوده است و ORM انتخابی هم Prisma می باشد. ERD طراحی شده برای این تسک به صورت زیر می باشد:

<img src="./ERD.png" alt="ERD Model for this Task management system">

## ساختار فولدر بندی و Structure
برای پیاده سازی بکند این تسک از Express.js استفاده شده است و از آنجایی که این فریم ورک یک فریم ورک Unopinionated است پس ساختاری که در این پروژه استفاده می شود کاملا به عهده برنامه نویس است. ساختاری که من استفاده کردم به شرح زیر است:

    Hamiket-Task/
        ├── prisma/
        │   ├── migrations/
        │   └── schema.prisma
        ├── src/
            ├── controllers/
            │   ├── index.js
            │   ├── task.controllers.js
            │   └── user.controllers.js
            ├── middlewares/
            │   ├── authorization.middleware.js
            │   ├── index.js
            │   └── validation.middleware.js
            ├── providers/
            │   ├── index.js
            │   └── user.provider.js
            ├── routes/
            │   ├── index.js
            │   ├── task.routes.js
            │   └── user.routes.js
            ├── services/
            │   ├── index.js
            │   ├── task.services.js
            │   └── user.services.js
            ├── utilities/
            │   ├── asyncErrorHandler.util.js
            │   ├── customErrorClass.util.js
            │   ├── databaseInstance.util.js
            │   ├── globalErrorHandler.util.js
            │   ├── index.js
            │   └── logger.util.js
        ├── tests/
        ├── app.js
        └── package.json

### Controllers
کنترلر ها **Endpoint** های ما هستند که وظیفه برگرداندن response و status code مناسب به کاربر را بر عهده دارند. تمامی فانکشن هایی که مربوط به مسیر های تعیین شده هستند و پاسخ نهایی را می دهند در این قسمت قرار دارند.

### Middlewares
فانکشن هایی برای بررسی و احراز هویت کاربران که قبل ازینکه request به دست کنترلر ها برسد اول از اینها می گذرد همگی در این قسمت قرار دارند از جمله **احراز هویت** کاربر و نیز ادمین بودن یا نبودن آن. همچنین بررسی درست بودن یا نبودن ورودی های مورد نیاز در هر API نیز در اینجا نوشته شده است که بعدا در Routes مورد استفاده قرار گرفته اند.

### Prisma
مدل های دیتابیس ما و همچنین یک فایل seeds برای اتوماتیک وارد کردن دیتای سمپل به دیتابیس در اینجا تعبیه شده است.

### Providers
درون کنترلر ها هر موقع که به انجام کاری که مستقیما به فرستادن پاسخ به کاربر مربوط نیست نیاز باشد, توابع آن در این قسمت نوشته شده که اما درون خود کنترلر استفاده خواهد شد. برای تمیز بودن کد استفاده شده است و همچنین قابلیت ماژولاریتی.

### Routes
نقطه تلاقی کنترلر ها با میدلور ها در این فولدر است. در واقع در اینجا مسیر هایی مشخص را برای کنترلر های خود تعریف کرده و به ترتیب از هر میدلور و یا Endpoint یی که نیاز است استفاده بشود در آنها استفاده میکنیم.

### Services
در هر جا که نیاز باشد مستقیما با **دیتابیس** ارتباط برقرار کنیم از توابع این قسمت استفاده خواهیم کرد و مستقیما خودمان در فولدر های مختلف توابع برقراری ارتباط را نمینویسیم.

### Utilities
این فولدر برای نیازمندی های پروژه است که در کنار Validation که در قسمت میدلور ها استفاده شده بود باید در پروژه حضور داشته باشند. عمده فایل های آن مربوط به **Error Handling** می باشد که به قسمت های مختلف تقسیم شده است. ساختار کلی آن به این صورت است که یک کلاس کاستوم شده برای ارور ها تعریف شده و نیز یک ارور هندلر گلوبال که با app.use به خود اپلیکیشن متصل شده است. هر وقت که اروری در هر جایی از برنامه رخ بدهد به این تابع گلوبال انتقال داده خواهد شد و با توجه به نوع ارور آن هندل خواهد شد. همچنین یک asyncErrorHandler هم پیاده سازی شده است که نیازی به try/catch های پی در پی نباشد و در فولدر routes روی کنترلر ها اعمال شده است. در حقیقت یک wrapper یی اطراف کنترلر ها هست که روی آنها به صورت خودکار try/catch اعمال می کند.

### App.js
فایل app که محل اصلی اپلیکیشن ماست و محل اجرای سرور می باشد. فایل db نیز کانکشن متصل شونده به دیتابیس را به سرویس ها می فرستد که نیز بقیه فولدر ها برای ارتباط با دیتابیس از سرویس ها استفاده خواهند کرد.

در هر فولدر نیز یک index.js وجود دارد که محل تجمیع توابع یا مقادیر قابل export در آن فولدر هستند برای اینکه در هنگام import کردن هر چیزی صرفا به این فابل رجوع کنیم.

نهایتا نیز **API Documentation** برای آن پیاده سازی شده است با استفاده از Swagger که بعد از ران کردن پروژه می توانید با استفاده از مسیر `localhost:PORT/api-docs` آن را مشاهده بفرمایید.
