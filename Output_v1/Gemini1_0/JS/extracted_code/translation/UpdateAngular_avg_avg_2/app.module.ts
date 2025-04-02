import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';

import { AppComponent } from './app.component';
import { todosReducer } from './todos.reducer';
import { TodosEffects } from './todos.effects';
import { TodoService } from './todos.service';

@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule,
    FormsModule,
    HttpClientModule,
    StoreModule.forRoot({ todos: todosReducer }),
    EffectsModule.forRoot([TodosEffects]),
  ],
  providers: [TodoService],
  bootstrap: [AppComponent],
})
export class AppModule {}