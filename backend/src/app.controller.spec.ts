// app.controller.spec.ts
import { Test, TestingModule } from '@nestjs/testing';
import { AppController } from './app.controller';

describe('AppController', () => {
    let appController: AppController;
    let app: TestingModule;

    beforeAll(async () => {
        app = await Test.createTestingModule({
            controllers: [AppController],
        }).compile();

        appController = app.get<AppController>(AppController);
    });

    describe('is_working', () => {
        it('should return "Hello I\'m Working!"', () => {
            expect(appController.is_working()).toBe("Hello I'm Working!");
        });
    });

    afterAll(async () => {
        await app.close();
    });
});