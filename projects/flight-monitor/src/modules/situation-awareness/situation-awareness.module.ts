import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { SituationAwarenessComponent } from "./components/situation-awareness/situation-awareness.component";

@NgModule({
  declarations: [
    SituationAwarenessComponent
  ],
  imports: [
    CommonModule
  ],
  exports: [
    SituationAwarenessComponent
  ]
})
export class SituationAwarenessModule { }
