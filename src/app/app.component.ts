import {Component, OnInit} from '@angular/core';
import {Card} from 'primeng/card';
import {TextareaModule} from 'primeng/textarea';
import {FormControl, FormGroup, FormsModule, ReactiveFormsModule} from '@angular/forms';
import {Button} from 'primeng/button';
import {MessageService} from 'primeng/api';
import {Toast} from 'primeng/toast';

@Component({
  selector: 'app-root',
  imports: [Card, TextareaModule, FormsModule, ReactiveFormsModule, Button, Toast],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
  providers: [MessageService]
})
export class AppComponent implements OnInit {
  txtAreaRows: number = 5;
  txtAreaMaxLength: number = 50000;
  txtAreaPlaceholder: string = 'Paste your SQL...';
  currentYear: number = new Date().getFullYear();

  formGroup!: FormGroup;
  formattedSql: string = '';

  constructor(private readonly messageService: MessageService) {
  }

  ngOnInit() {
    this.formGroup = new FormGroup({
      sqlInput: new FormControl<string>('')
    });
  }


  // ----- helper methods ----- //


  formatSql() {
    const statements: string[] = this.formGroup.get('sqlInput')!.value
      .split(/;\s*/)
      .filter((statement: string) => statement.trim() !== ""); // Remove empty statements

    // Helper function to format a single INSERT statement
    function formatInsert(statement: string) {
      // Normalize input by removing extra spaces and joining lines
      const normalizedInput = statement
        .replace(/\s+/g, " ") // Replace multiple spaces with a single space
        .replace(/\s*,\s*/g, ", ") // Ensure single space after commas
        .trim();

      // Extract the part from "INSERT" to "VALUES"
      const headerMatch = RegExp(/^(insert\s+into\s+[^(]+)\((.*?)\)\s+values/i).exec(normalizedInput);
      if (!headerMatch) {
        return "Invalid SQL INSERT query format.";
      }

      const insertStatement = headerMatch[1].trim();
      const fields = headerMatch[2].split(",").map((field) => field.trim());
      const valuesPart = normalizedInput
        .slice(headerMatch[0].length)
        .trim()
        .replace(/^\(|\);?$/g, "") // Remove starting and ending parentheses
        .split(/\)\s*,\s*\(/) // Split rows by closing and opening parentheses
        .map((row) => row.split(",").map((value) => value.trim()));

      // Calculate maximum widths for each column
      const columnWidths = valuesPart[0].map((_, colIndex) =>
        Math.max(
          ...valuesPart.map((row) => row[colIndex]?.length || 0),
          fields[colIndex].length // Include field lengths in width calculations
        )
      );

      // Align the field names perfectly with the values
      const formattedFields = fields
        .map((field, index) => field.padEnd(columnWidths[index]))
        .join(", ");

      // Format the values into aligned rows
      const formattedValues = valuesPart
        .map((row) =>
          row
            .map((value, colIndex) => value.padEnd(columnWidths[colIndex]))
            .join(", ")
        )
        .map((line) => `(${line})`)
        .join(",\n");

      // Combine the header, formatted fields, and formatted values
      return `${insertStatement} (\n ${formattedFields}\n) values\n${formattedValues};`;
    }

    // Format each statement and combine them with a newline
    this.formattedSql = statements.map(formatInsert).join("\n\n");
  }

  copyToClipboard() {
    navigator.clipboard.writeText(this.formattedSql).then(() => {
      this.showCopyToast();
    }).catch(console.error);
  }

  showCopyToast() {
    this.messageService.add({severity: 'info', summary: 'Copied!', detail: 'SQL copied to clipboard', life: 3000});
  }
}
