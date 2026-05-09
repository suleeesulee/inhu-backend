import { AdminServerModule } from '@admin/admin-server.module';
import { TestHelper } from '../../setup/test.helper';
import { CafeteriaSeedHelper } from '@libs/testing/seed/cafeteria/cafeteria.seed';
import { CafeteriaCoreService } from '@libs/core/cafeteria/cafeteria-core.service';

describe('Cafeteria e2e test', () => {
  const testHelper = TestHelper.create(AdminServerModule);
  const cafeteriaSeedHelper = testHelper.seedHelper(CafeteriaSeedHelper);

  beforeEach(async () => {
    await testHelper.init();
  });

  afterEach(async () => {
    await testHelper.destroy();
  });

  describe('GET /cafeteria/all', () => {
    it('200 - field check', async () => {
      const admin = testHelper.loginAdmin.admin1;
      const cafeteria = await cafeteriaSeedHelper.seed({
        name: 'test cafeteria',
      });

      const response = await testHelper
        .test()
        .get('/cafeteria/all')
        .set('Cookie', `token=Bearer ${admin.token}`)
        .expect(200);

      expect(response.body[0].idx).toBe(cafeteria.idx);
      expect(response.body[0].name).toBe(cafeteria.name);
    });

    it('200 - empty response', async () => {
      const admin = testHelper.loginAdmin.admin1;

      const response = await testHelper
        .test()
        .get('/cafeteria/all')
        .set('Cookie', `token=Bearer ${admin.token}`)
        .expect(200);

      expect(response.body).toEqual([]);
    });

    // it('200 - multiple cafeteria response', async () => {
    //   const admin = testHelper.loginAdmin.admin1;
    //   const cafeteria1 = await cafeteriaSeedHelper.seed({
    //     name: 'test cafeteria 1',
    //   });
    //   const cafeteria2 = await cafeteriaSeedHelper.seed({
    //     name: 'test cafeteria 2',
    //   });

    //   const response = await testHelper
    //     .test()
    //     .get('/cafeteria/all')
    //     .set('Cookie', `token=Bearer ${admin.token}`)
    //     .expect(200);

    //   expect(response.body.length).toBe(2);
    //   expect(response.body[0].idx).toBe(cafeteria1.idx);
    //   expect(response.body[0].name).toBe(cafeteria1.name);
    //   expect(response.body[1].idx).toBe(cafeteria2.idx);
    //   expect(response.body[1].name).toBe(cafeteria2.name);
    // });

    it('200 - successfully get cafeteria list (super admin)', async () => {
      const superAdmin = testHelper.loginAdmin.superAdmin;
      const cafeteria = await cafeteriaSeedHelper.seed({
        name: 'test cafeteria',
      });

      const response = await testHelper
        .test()
        .get('/cafeteria/all')
        .set('Cookie', `token=Bearer ${superAdmin.token}`)
        .expect(200);

      expect(response.body[0].idx).toBe(cafeteria.idx);
      expect(response.body[0].name).toBe(cafeteria.name);
    });

    it('200 - successfully get cafeteria list (admin)', async () => {
      const admin = testHelper.loginAdmin.admin1;
      const cafeteria = await cafeteriaSeedHelper.seed({
        name: 'test cafeteria',
      });

      const response = await testHelper
        .test()
        .get('/cafeteria/all')
        .set('Cookie', `token=Bearer ${admin.token}`)
        .expect(200);

      expect(response.body[0].idx).toBe(cafeteria.idx);
      expect(response.body[0].name).toBe(cafeteria.name);
    });

    it('401 - token not provided', async () => {
      await cafeteriaSeedHelper.seed({
        name: 'test cafeteria',
      });

      await testHelper.test().get('/cafeteria/all').expect(401);
    });

    it('403 - unauthorized role (magazine admin)', async () => {
      const placeAdmin = testHelper.loginAdmin.magazineAdmin1;

      await cafeteriaSeedHelper.seed({
        name: 'test cafeteria',
      });

      await testHelper
        .test()
        .get('/cafeteria/all')
        .set('Cookie', `token=Bearer ${placeAdmin.token}`)
        .expect(403);
    });

    it('403 - unauthorized role (all admin)', async () => {
      const allAdmin = testHelper.loginAdmin.allAdmin1;

      await cafeteriaSeedHelper.seed({
        name: 'test cafeteria',
      });

      await testHelper
        .test()
        .get('/cafeteria/all')
        .set('Cookie', `token=Bearer ${allAdmin.token}`)
        .expect(403);
    });
  });

  describe('POST /cafeteria', () => {
    it('201 - successfully create cafeteria', async () => {
      const admin = testHelper.loginAdmin.admin1;

      const createCafeteriaDto = {
        name: 'test cafeteria',
      };

      const response = await testHelper
        .test()
        .post('/cafeteria')
        .set('Cookie', `token=Bearer ${admin.token}`)
        .send(createCafeteriaDto)
        .expect(201);

      expect(response.body.idx).toBeDefined();
      expect(response.body.name).toBe(createCafeteriaDto.name);
    });

    it('401 - token not provided', async () => {
      const createCafeteriaDto = {
        name: 'test cafeteria',
      };

      await testHelper
        .test()
        .post('/cafeteria')
        .send(createCafeteriaDto)
        .expect(401);
    });

    it('201 - successfully create cafeteria (super admin)', async () => {
      const superAdmin = testHelper.loginAdmin.superAdmin;

      const createCafeteriaDto = {
        name: 'test cafeteria',
      };

      const response = await testHelper
        .test()
        .post('/cafeteria')
        .set('Cookie', `token=Bearer ${superAdmin.token}`)
        .send(createCafeteriaDto)
        .expect(201);

      expect(response.body.idx).toBeDefined();
      expect(response.body.name).toBe(createCafeteriaDto.name);
    });

    it('201 - successfully create cafeteria (admin)', async () => {
      const admin = testHelper.loginAdmin.admin1;

      const createCafeteriaDto = {
        name: 'test cafeteria',
      };

      const response = await testHelper
        .test()
        .post('/cafeteria')
        .set('Cookie', `token=Bearer ${admin.token}`)
        .send(createCafeteriaDto)
        .expect(201);

      expect(response.body.idx).toBeDefined();
      expect(response.body.name).toBe(createCafeteriaDto.name);
    });

    it('400 - name is empty', async () => {
      const admin = testHelper.loginAdmin.admin1;

      const createCafeteriaDto = {
        name: '',
      };

      await testHelper
        .test()
        .post('/cafeteria')
        .set('Cookie', `token=Bearer ${admin.token}`)
        .send(createCafeteriaDto)
        .expect(400);
    });

    it('403 - unauthorized role (magazine admin)', async () => {
      const magazineAdmin = testHelper.loginAdmin.magazineAdmin1;

      const createCafeteriaDto = {
        name: 'test cafeteria',
      };

      await testHelper
        .test()
        .post('/cafeteria')
        .set('Cookie', `token=Bearer ${magazineAdmin.token}`)
        .send(createCafeteriaDto)
        .expect(403);
    });

    it('403 - unauthorized role (all admin)', async () => {
      const allAdmin = testHelper.loginAdmin.allAdmin1;

      const createCafeteriaDto = {
        name: 'test cafeteria',
      };

      await testHelper
        .test()
        .post('/cafeteria')
        .set('Cookie', `token=Bearer ${allAdmin.token}`)
        .send(createCafeteriaDto)
        .expect(403);
    });
  });

  describe('PUT /cafeteria/:idx', () => {
    it('200 - successfully update cafeteria', async () => {
      const admin = testHelper.loginAdmin.admin1;
      const cafeteria = await cafeteriaSeedHelper.seed({
        name: 'test cafeteria',
      });

      const updateCafeteriaDto = {
        name: 'updated cafeteria',
      };

      await testHelper
        .test()
        .put(`/cafeteria/${cafeteria.idx}`)
        .set('Cookie', `token=Bearer ${admin.token}`)
        .send(updateCafeteriaDto)
        .expect(200);

      const updatedCafeteriaModel = await testHelper
        .get(CafeteriaCoreService)
        .getCafeteriaByIdx(cafeteria.idx);

      expect(updatedCafeteriaModel!.idx).toBe(cafeteria.idx);
      expect(updatedCafeteriaModel!.name).toBe(updateCafeteriaDto.name);
    });

    it('200 - successfully update cafeteria (super admin)', async () => {
      const superAdmin = testHelper.loginAdmin.superAdmin;
      const cafeteria = await cafeteriaSeedHelper.seed({
        name: 'test cafeteria',
      });

      const updateCafeteriaDto = {
        name: 'updated cafeteria',
      };

      await testHelper
        .test()
        .put(`/cafeteria/${cafeteria.idx}`)
        .set('Cookie', `token=Bearer ${superAdmin.token}`)
        .send(updateCafeteriaDto)
        .expect(200);

      const updatedCafeteriaModel = await testHelper
        .get(CafeteriaCoreService)
        .getCafeteriaByIdx(cafeteria.idx);

      expect(updatedCafeteriaModel!.idx).toBe(cafeteria.idx);
      expect(updatedCafeteriaModel!.name).toBe(updateCafeteriaDto.name);
    });

    it('200 - successfully update cafeteria (admin)', async () => {
      const admin = testHelper.loginAdmin.admin1;
      const cafeteria = await cafeteriaSeedHelper.seed({
        name: 'test cafeteria',
      });

      const updateCafeteriaDto = {
        name: 'updated cafeteria',
      };

      await testHelper
        .test()
        .put(`/cafeteria/${cafeteria.idx}`)
        .set('Cookie', `token=Bearer ${admin.token}`)
        .send(updateCafeteriaDto)
        .expect(200);

      const updatedCafeteriaModel = await testHelper
        .get(CafeteriaCoreService)
        .getCafeteriaByIdx(cafeteria.idx);

      expect(updatedCafeteriaModel!.idx).toBe(cafeteria.idx);
      expect(updatedCafeteriaModel!.name).toBe(updateCafeteriaDto.name);
    });

    it('400 - invalid idx', async () => {
      const admin = testHelper.loginAdmin.admin1;

      const updateCafeteriaDto = {
        name: 'updated cafeteria',
      };

      await testHelper
        .test()
        .put('/cafeteria/invalid-idx')
        .set('Cookie', `token=Bearer ${admin.token}`)
        .send(updateCafeteriaDto)
        .expect(400);
    });

    it('400 - empty name', async () => {
      const admin = testHelper.loginAdmin.admin1;
      const cafeteria = await cafeteriaSeedHelper.seed({
        name: 'test cafeteria',
      });

      const updateCafeteriaDto = {
        name: '',
      };

      await testHelper
        .test()
        .put(`/cafeteria/${cafeteria.idx}`)
        .set('Cookie', `token=Bearer ${admin.token}`)
        .send(updateCafeteriaDto)
        .expect(400);
    });

    it('403 - unauthorized role (magazine admin)', async () => {
      const magazineAdmin = testHelper.loginAdmin.magazineAdmin1;
      const cafeteria = await cafeteriaSeedHelper.seed({
        name: 'test cafeteria',
      });

      const updateCafeteriaDto = {
        name: 'updated cafeteria',
      };

      await testHelper
        .test()
        .put(`/cafeteria/${cafeteria.idx}`)
        .set('Cookie', `token=Bearer ${magazineAdmin.token}`)
        .send(updateCafeteriaDto)
        .expect(403);
    });

    it('403 - unauthorized role (all admin)', async () => {
      const allAdmin = testHelper.loginAdmin.allAdmin1;
      const cafeteria = await cafeteriaSeedHelper.seed({
        name: 'test cafeteria',
      });

      const updateCafeteriaDto = {
        name: 'updated cafeteria',
      };

      await testHelper
        .test()
        .put(`/cafeteria/${cafeteria.idx}`)
        .set('Cookie', `token=Bearer ${allAdmin.token}`)
        .send(updateCafeteriaDto)
        .expect(403);
    });

    it('404 - cafeteria not found', async () => {
      const admin = testHelper.loginAdmin.admin1;

      const updateCafeteriaDto = {
        name: 'updated cafeteria',
      };

      await testHelper
        .test()
        .put('/cafeteria/9999')
        .set('Cookie', `token=Bearer ${admin.token}`)
        .send(updateCafeteriaDto)
        .expect(404);
    });
  });

  describe('DELETE /cafeteria/:idx', () => {
    it('200 - successfully delete cafeteria', async () => {
      const admin = testHelper.loginAdmin.admin1;
      const cafeteria = await cafeteriaSeedHelper.seed({
        name: 'test cafeteria',
      });

      await testHelper
        .test()
        .delete(`/cafeteria/${cafeteria.idx}`)
        .set('Cookie', `token=Bearer ${admin.token}`)
        .expect(200);

      const prisma = testHelper.getPrisma();
      const deletedCafeteria = await prisma.cafeteria.findUnique({
        where: { idx: cafeteria.idx },
      });

      expect(deletedCafeteria?.deletedAt).not.toBeNull();
    });

    it('200 - successfully delete cafeteria (super admin)', async () => {
      const superAdmin = testHelper.loginAdmin.superAdmin;
      const cafeteria = await cafeteriaSeedHelper.seed({
        name: 'test cafeteria',
      });

      await testHelper
        .test()
        .delete(`/cafeteria/${cafeteria.idx}`)
        .set('Cookie', `token=Bearer ${superAdmin.token}`)
        .expect(200);

      const prisma = testHelper.getPrisma();
      const deletedCafeteria = await prisma.cafeteria.findUnique({
        where: { idx: cafeteria.idx },
      });

      expect(deletedCafeteria?.deletedAt).not.toBeNull();
    });

    it('200 - successfully delete cafeteria (admin)', async () => {
      const admin = testHelper.loginAdmin.admin1;
      const cafeteria = await cafeteriaSeedHelper.seed({
        name: 'test cafeteria',
      });

      await testHelper
        .test()
        .delete(`/cafeteria/${cafeteria.idx}`)
        .set('Cookie', `token=Bearer ${admin.token}`)
        .expect(200);

      const prisma = testHelper.getPrisma();
      const deletedCafeteria = await prisma.cafeteria.findUnique({
        where: { idx: cafeteria.idx },
      });

      expect(deletedCafeteria?.deletedAt).not.toBeNull();
    });

    it('400 - invalid idx', async () => {
      const admin = testHelper.loginAdmin.admin1;

      await testHelper
        .test()
        .delete('/cafeteria/invalid-idx')
        .set('Cookie', `token=Bearer ${admin.token}`)
        .expect(400);
    });

    it('403 - unauthorized role (magazine admin)', async () => {
      const magazineAdmin = testHelper.loginAdmin.magazineAdmin1;
      const cafeteria = await cafeteriaSeedHelper.seed({
        name: 'test cafeteria',
      });

      await testHelper
        .test()
        .delete(`/cafeteria/${cafeteria.idx}`)
        .set('Cookie', `token=Bearer ${magazineAdmin.token}`)
        .expect(403);
    });

    it('403 - unauthorized role (all admin)', async () => {
      const allAdmin = testHelper.loginAdmin.allAdmin1;
      const cafeteria = await cafeteriaSeedHelper.seed({
        name: 'test cafeteria',
      });

      await testHelper
        .test()
        .delete(`/cafeteria/${cafeteria.idx}`)
        .set('Cookie', `token=Bearer ${allAdmin.token}`)
        .expect(403);
    });

    it('404 - cafeteria not found', async () => {
      const admin = testHelper.loginAdmin.admin1;

      await testHelper
        .test()
        .delete('/cafeteria/9999')
        .set('Cookie', `token=Bearer ${admin.token}`)
        .expect(404);
    });
  });
});
