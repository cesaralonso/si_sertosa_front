import { NgModule, ModuleWithProviders }      from '@angular/core';
import { CommonModule }  from '@angular/common';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { AppTranslationModule } from '../app.translation.module';
import { SocketIOService } from '../shared/services/socketio.service';

import {
BaThemeConfig
} from './theme.config';

import {
BaThemeConfigProvider
} from './theme.configProvider';

import {
BaBackTop,
BaCard,
BaCheckbox,
BaContentTop,
BaMenuItem,
BaMenu,
BaMsgCenter,
BaMultiCheckbox,
BaPageTop,
BaSidebar,
CardFlipComponent
} from './components';

import { BaCardBlur } from './components/baCard/baCardBlur.directive';

import {
BaScrollPosition,
BaSlimScroll,
BaThemeRun
} from './directives';


import {
BaImageLoaderService,
BaMenuService,
BaThemePreloader,
BaThemeSpinner
} from './services';

import {
EmailValidator,
EqualPasswordsValidator
} from './validators';

const NGA_COMPONENTS = [
BaBackTop,
BaCard,
BaCheckbox,
BaContentTop,
BaMenuItem,
BaMenu,
BaMsgCenter,
BaMultiCheckbox,
BaPageTop,
BaSidebar,
CardFlipComponent
];

const NGA_DIRECTIVES = [
BaScrollPosition,
BaSlimScroll,
BaThemeRun,
BaCardBlur
];


const NGA_SERVICES = [
BaImageLoaderService,
BaThemePreloader,
BaThemeSpinner,
BaMenuService,
SocketIOService
];

const NGA_VALIDATORS = [
EmailValidator,
EqualPasswordsValidator
];

@NgModule({
declarations: [
    ...NGA_DIRECTIVES,
    ...NGA_COMPONENTS
],
imports: [
    CommonModule,
    RouterModule,
    FormsModule,
    ReactiveFormsModule,
    AppTranslationModule
],
exports: [
    ...NGA_DIRECTIVES,
    ...NGA_COMPONENTS
]
})
export class NgaModule {
static forRoot(): ModuleWithProviders<any> {
    return {
    ngModule: NgaModule,
    providers: [
        BaThemeConfigProvider,
        BaThemeConfig,
        ...NGA_VALIDATORS,
        ...NGA_SERVICES
    ],
    };
}
}
