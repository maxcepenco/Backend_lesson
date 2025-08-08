import {app} from './app';

const PORT = process.env.PORT || 3000;

// Запускать сервер только при прямом вызове файла
if (require.main === module) {
    app.listen(PORT, () => {
        console.log(`Server started on port ${PORT}`);
    });
}
