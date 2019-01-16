import { Component, OnInit, ViewChild, ChangeDetectorRef } from '@angular/core';
import { DataService } from '../services';
import { ObservableArray } from "tns-core-modules/data/observable-array";
import { ChartsComponent } from '../charts-component/charts-component.component';
import { ListViewLinearLayout, RadListView, LoadOnDemandListViewEventData } from "nativescript-ui-listview";
import {PageEvent} from '@angular/material';
import { Router} from '@angular/router';

import { SearchBar } from "tns-core-modules/ui/search-bar";
import { Page } from "tns-core-modules/ui/page";


@Component({
  selector: 'app-block-list-tns',
  templateUrl: './block-list.component.tns.html',
  styleUrls: ['./block-list.component.tns.css']
})
export class BlockListComponentTns implements OnInit {
  private _dataItems: ObservableArray<any>;
    private layout: ListViewLinearLayout;

  status : any; // basically latest block and some data
  blocks : any;
  count : number;
  page : number = 0;
  searchItem : string;

  loading_status : boolean = false;
  loading_blocks : boolean = false;

  constructor(
    private dataService: DataService,
    private router: Router,
    private pageTns: Page,
    private _changeDetectionRef: ChangeDetectorRef) {}

  public loadBlocks(event?:PageEvent){

    this.loading_blocks = true;
    this.page = event ? event.pageIndex : 0;

    this.dataService.loadBlocks(this.page).subscribe((data) => {
      this.loading_blocks = false;

      this.blocks = data['results'];
      this.dataItems.push(data['results']);
      this.count = data['count'];
      this.page++;
     });

    return event;
  }

  public onSubmit(args) {
      let searchBar = <SearchBar>args.object;
      alert("You are searching for " + searchBar.text);
  }

  public searchBarLoaded(args){
    let searchBar:SearchBar = <SearchBar>args.object;
    //if(isAndroid){
      searchBar.android.clearFocus();
    //}
  }

  public onTextChanged(args) {
      let searchBar = <SearchBar>args.object;
      console.log("SearchBar text changed! New value: " + searchBar.text);
  }

  public showBlockDetails(hash) {
    this.router.navigate(
      ['/block', hash]
    );
  }

  ngOnInit() {
    this.pageTns.actionBarHidden = true;
    this.loading_status = true;

    this.layout = new ListViewLinearLayout();
        this.layout.scrollDirection = "Vertical";
        this._changeDetectionRef.detectChanges();
        this._dataItems = new ObservableArray<any>();


    this.dataService.loadStatus().subscribe((status) => {
      this.status = status;
      this.loading_status = false;
    });

    this.loadBlocks(null);
  }

  public get dataItems(): ObservableArray<any> {
        return this._dataItems;
    }

    public onLoadMoreItemsRequested(args: LoadOnDemandListViewEventData) {
      const listView: RadListView = args.object;
      this.dataService.loadBlocks().subscribe((data) => {
        this.loading_blocks = false;
        this.blocks = data['results'];

        this.dataItems.push(data['results']);
        listView.notifyLoadOnDemandFinished();
        this.page++;
        args.returnValue = true;
       });
    }
}