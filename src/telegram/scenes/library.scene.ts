import { Command, Ctx, Hears, Scene, SceneEnter } from 'nestjs-telegraf';
import { TelegrafContext } from '../telegram.interfaces';
import { SCENES } from '../telegram.scenes';
import { Markup } from 'telegraf';
import { BaseScene } from './base.scene';
import { TriliumService } from '../../trilium/trilium.service';

const SceneCommands = {
  bookList: 'Список книг',
  bookDownload: 'Скачать книгу',
  back: 'Назад',
} as const;

@Scene(SCENES.LIBRARY_SCENE)
export class LibraryScene extends BaseScene {
  constructor(private readonly triliumService: TriliumService) {
    super();
  }

  @SceneEnter()
  async onSceneEnter(@Ctx() ctx: TelegrafContext) {
    return await ctx.reply(
      'Выберите действие',
      await this.buildSceneKeyboard(),
    );
  }

  private async buildSceneKeyboard() {
    const buttons = [];
    for (const key in SceneCommands) {
      buttons.push(Markup.button.text(SceneCommands[key]));
    }
    return Markup.keyboard(buttons).oneTime().resize();
  }

  @Hears(SceneCommands.bookList)
  async getListBook(@Ctx() ctx: TelegrafContext) {
    const msg = await this.triliumService.getBookList();
    return await ctx.reply(
      `Cписок книг: \n ${msg}`,
      await this.buildSceneKeyboard(),
    );
  }

  @Hears(SceneCommands.bookDownload)
  async bookDownload(@Ctx() ctx: TelegrafContext) {
    await ctx.reply('Теперь вы можете скачать книгу');
    return;
  }

  @Command(SceneCommands.back)
  async exit(@Ctx() ctx: TelegrafContext) {
    return ctx.scene.enter(SCENES.WELCOME_SCENE);
  }
}
