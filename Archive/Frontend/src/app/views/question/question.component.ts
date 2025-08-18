import { Component, OnInit, Input } from '@angular/core';
import { AppService } from '../../app.service';
import { QuestionModel } from '../model/ndc/question-model';

@Component({
  selector: 'app-question',
  templateUrl: './question.component.html',
  styleUrls: ['./question.component.scss']
})
export class QuestionComponent implements OnInit {

  @Input() question:QuestionModel;
  @Input() type:string;
  @Input() likelihoodArr: string[];
  @Input() impactArr: string[];
  @Input() approvalScreen: boolean;
  @Input() ynArr: string[];

  constructor(private appService:AppService) { }

  ngOnInit() {
    
  }
  likelihoodSelect(value) {
    this.question.likelihood = value;
  }
  ynSelect(value) {
    
    // this.question.dataSource = value;
  }
  impactSelect(value) {
    this.question.impact = value;
  }

}
