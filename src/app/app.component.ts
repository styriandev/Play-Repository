import { Component, OnDestroy } from '@angular/core';
import {RxState, selectSlice} from '@rx-angular/state';
import {Recipe, StateRepository} from './state-repository';
import { Observable, ReplaySubject } from 'rxjs';
import { map, share, shareReplay, takeUntil } from 'rxjs/operators';

interface State {
  index: number;
  recipes: Recipe[];
}

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  providers: [ RxState ]
})
export class AppComponent implements OnDestroy {
  title = 'my-advent';
  recipeIndex$: Observable<number>;
  recipes$: Observable<Recipe[]>;
  recipe$: Observable<Recipe>;
  hasPrevious$: Observable<boolean>;
  hasNext$: Observable<boolean>;
  standardWayOfRecipes$: Observable<Recipe[]>;

  private destroyed$: ReplaySubject<void> = new ReplaySubject<void>(1);

  constructor(private _state: RxState<State>,
              private stateRepository: StateRepository) {
    this.standardWayOfRecipes$ = this.stateRepository.recipes.pipe(
      map((recipe) => {
        console.log('Computing...');
        return recipe;
      }),
      shareReplay({
        bufferSize: 1,
        refCount: true
      }),
      takeUntil(this.destroyed$)
    );

    this._state.set({ index: 0 });
    this.recipeIndex$ = this._state.select('index');
    this.recipes$ = this._state.select('recipes');
    this.recipe$ = this._state.select(map(({ recipes, index }) => {
      console.log('Computing...');
      return recipes?.[index];
    }));
    this.hasPrevious$ = this.recipeIndex$.pipe(map((idx) => idx > 0));
    this.hasNext$ = this._state.select(
      selectSlice(['index', 'recipes']), // better because than only these parts of the state are returned
      map(({ recipes, index }) => {
        return index + 1 < (recipes?.length ?? 0)
      })
    );


    this._state.connect('recipes', this.stateRepository.recipes);
  }

  next(): void {
    this._state.set('index', ({index}) => index + 1);
  }

  previous(): void {
    this._state.set('index', ({index}) => index - 1);
  }

  ngOnDestroy(): void {
    this.destroyed$.next();
  }
}
