import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';


@Component({
  selector: 'app-filestatus',
  templateUrl: './filestatus.component.html',
  styleUrls: ['./filestatus.component.scss']
})
export class FilestatusComponent implements OnInit {

  importFiles: any[] = [];

  constructor(private router: Router, private http: HttpClient) { }

  ngOnInit(): void {
    // Fetch the import files from the backend when the component initializes
    this.fetchImportFiles();
  }

  fetchImportFiles() {
    // Correct string interpolation for the URL
    this.http.get(`${environment.apiUrl}/auth/retrieve-files`).subscribe(
      (files) => {
        this.importFiles = files as any[];
      },
      (error) => {
        console.error('Error fetching import files:', error);
      }
    );
  }

  downloadErrorFile(errorFileUrl: string) {
    const link = document.createElement('a');
    link.href = errorFileUrl;
    link.download = errorFileUrl.split('/').pop() || 'default-filename'; // Optional: Set the filename based on the URL
    link.click();
  }
  redirecttodashboard(){
    this.router.navigate(['./dashboard']);
  }
  
}
