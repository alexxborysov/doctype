import {
  Body,
  Controller,
  Get,
  HttpException,
  HttpStatus,
  Post,
  Req,
  UseGuards,
  UsePipes,
} from '@nestjs/common';
import { RoleGuard } from '../auth/guards/role.guard';
import { Roles } from '../auth/guards/roles.decorator';
import { ZodValidationPipe } from '~/kernel/pipes/zod.validation.pipe';
import { NoteStrictSchema } from 'core/dist-cjs/src/dto/note.dto';
import { DBService } from '~/infrastructure/db/db.service';
import { AuthService } from '../auth/services/auth.service';
import { Request } from 'express';
import { z } from 'zod';
import dayjs from 'dayjs';

@Controller('note')
export class NoteController {
  constructor(
    private db: DBService,
    private authService: AuthService
  ) {}

  @Post('create')
  @UseGuards(RoleGuard)
  @Roles('USER')
  @UsePipes(new ZodValidationPipe(NoteStrictSchema))
  async create(@Body() body: z.infer<typeof NoteStrictSchema>) {
    const created = await this.db.note.create({
      data: body,
    });
    return {
      ok: true,
      message: 'Note successfully created',
      createdId: created.id,
    };
  }

  @Get('get')
  @UseGuards(RoleGuard)
  @Roles('USER')
  async get(@Req() req: Request) {
    const reqSession = await this.authService.extractReqSession(req);
    const items = await this.db.note.findMany({
      where: {
        userId: reqSession?.sub,
      },
    });

    return {
      ok: true,
      items,
    };
  }

  @Post('rename')
  @UseGuards(RoleGuard)
  @Roles('USER')
  @UsePipes(
    new ZodValidationPipe(
      NoteStrictSchema.pick({
        id: true,
        name: true,
        lastUpdatedTime: true,
      })
    )
  )
  async rename(
    @Body()
    body: Pick<
      z.infer<typeof NoteStrictSchema>,
      'id' | 'name' | 'lastUpdatedTime'
    >,
    @Req() req: Request
  ) {
    const reqSession = await this.authService.extractReqSession(req);
    const renamed = await this.db.note
      .update({
        where: {
          id: body.id,
          userId: reqSession?.sub,
        },
        data: {
          name: body.name,
          lastUpdatedTime: body.lastUpdatedTime,
        },
      })
      .catch((err) => {
        throw new HttpException(err?.meta?.cause, HttpStatus.CONFLICT);
      });

    return {
      ok: Boolean(renamed),
      message: renamed && 'Note successfully renamed',
    };
  }

  @Post('updateSource')
  @UseGuards(RoleGuard)
  @Roles('USER')
  @UsePipes(
    new ZodValidationPipe(
      NoteStrictSchema.pick({
        id: true,
        source: true,
        lastUpdatedTime: true,
      })
    )
  )
  async updateSource(
    @Body()
    body: Pick<
      z.infer<typeof NoteStrictSchema>,
      'id' | 'source' | 'lastUpdatedTime'
    >,
    @Req() req: Request
  ) {
    const reqSession = await this.authService.extractReqSession(req);
    const existed = await this.db.note.findFirst({
      where: {
        id: body.id,
      },
    });
    if (!existed) {
      throw new HttpException('Note not found', HttpStatus.CONFLICT);
    }

    const isOutdated = dayjs(existed.lastUpdatedTime).isAfter(
      body.lastUpdatedTime
    );
    if (isOutdated) {
      throw new HttpException('Outdated payload', HttpStatus.CONFLICT);
    }

    const updated = await this.db.note
      .update({
        where: {
          id: body.id,
          userId: reqSession?.sub,
        },
        data: {
          source: body.source,
          lastUpdatedTime: body.lastUpdatedTime,
        },
      })
      .catch((err) => {
        throw new HttpException(err?.meta?.cause, HttpStatus.CONFLICT);
      });

    return {
      ok: Boolean(updated),
      message: updated && 'Note Source successfully updated',
    };
  }

  @Post('remove')
  @UseGuards(RoleGuard)
  @Roles('USER')
  @UsePipes(
    new ZodValidationPipe(
      NoteStrictSchema.pick({
        id: true,
      })
    )
  )
  async remove(
    @Body()
    body: Pick<z.infer<typeof NoteStrictSchema>, 'id'>,
    @Req() req: Request
  ) {
    const reqSession = await this.authService.extractReqSession(req);
    const deleted = await this.db.note.delete({
      where: {
        id: body?.id,
        userId: reqSession?.sub,
      },
    });

    return {
      ok: Boolean(deleted),
      message: deleted && 'Note has been deleted',
    };
  }
}
