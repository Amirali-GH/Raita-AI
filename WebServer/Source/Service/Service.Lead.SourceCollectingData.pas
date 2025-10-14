Unit Service.Lead.SourceCollectingData;

Interface

Uses
  System.SysUtils,
  System.Generics.Collections,
  MVCFramework.ActiveRecord,
  MVCFramework.Nullables,
  Model.Lead.SourceCollectingData,
  Service.Interfaces;

Type
  TSourceCollectingDataService = Class(TInterfacedObject, ISourceCollectingDataService)
  Public
    Function GetAllSourceCollectingData(Var APage: String; Const AStatus: String; Const AContext: String): TObjectList<TLead_SourceCollectingData>;
    Function GetSourceCollectingDataByID(Const AID: Integer): TLead_SourceCollectingData;
    Function CreateSourceCollectingData(Const ASourceData: TLead_SourceCollectingData): TLead_SourceCollectingData;
    Function UpdateSourceCollectingDataPartial(Const AID: Integer; Const ASourceData: TLead_SourceCollectingData): TLead_SourceCollectingData;
    Function DeleteSourceCollectingData(Const AID: Integer): Boolean;
  End;

Implementation

Uses Utils, Math, StrUtils, WebModule.SalamtCRM; // Adjust your uses as needed

{ TSourceCollectingDataService }

//________________________________________________________________________________________
Function TSourceCollectingDataService.GetAllSourceCollectingData(Var APage: String; Const AStatus: String;
  Const AContext: String): TObjectList<TLead_SourceCollectingData>;
Var
  LCurrPage: Integer;
  LFirstRec: Integer;
  LActive, LSearchField: String;
Begin
  LCurrPage := 0;
  TryStrToInt(APage, LCurrPage);

  LCurrPage := Max(LCurrPage, 1);
  LFirstRec := (LCurrPage - 1) * PAGE_SIZE;
  APage := LCurrPage.ToString;

  If (Not AContext.IsEmpty) then
  Begin
    LSearchField := Format(
      '(Code LIKE %s OR Name LIKE %s)',
      [QuotedStr('%' + AContext + '%'), QuotedStr('%' + AContext + '%')]
    );
  End
  Else
  Begin
    LSearchField := '';
  End;

  If (AStatus.IsEmpty) Or (AStatus.ToLower = 'active') then
  Begin
    LActive := 'IsActive = 1';
  End
  Else If (AStatus.ToLower = 'notactive') then
  Begin
    LActive := 'IsActive = 0';
  End
  Else
  Begin
    LActive := '1=1';
  End;

  If (Not LSearchField.IsEmpty) AND (Not LActive.IsEmpty) then
  Begin
    LActive := ' AND ' + LActive;
  End;

  Result := TMVCActiveRecord.Where<TLead_SourceCollectingData>(
    LSearchField + LActive + ' ORDER BY Code ASC, Name ASC limit ?,?',
    [LFirstRec, PAGE_SIZE]);
End;
//________________________________________________________________________________________
Function TSourceCollectingDataService.GetSourceCollectingDataByID(Const AID: Integer): TLead_SourceCollectingData;
Begin
  Result := TMVCActiveRecord.GetByPK<TLead_SourceCollectingData>(AID, False);
End;
//________________________________________________________________________________________
Function TSourceCollectingDataService.CreateSourceCollectingData(Const ASourceData: TLead_SourceCollectingData): TLead_SourceCollectingData;
Var
  LCopy: TLead_SourceCollectingData;
Begin
  LCopy := TLead_SourceCollectingData.Create;
  Try
    LCopy.Code := ASourceData.Code;
    LCopy.Name := ASourceData.Name;
    LCopy.Link := ASourceData.Link;
    LCopy.Description := ASourceData.Description;

    If (ASourceData.IsActive.HasValue) then
    Begin
      LCopy.IsActive := ASourceData.IsActive;
    End
    Else
    Begin
      LCopy.IsActive := True;
    End;

    LCopy.Insert;
    Result := GetSourceCollectingDataByID(LCopy.SourceCollectingDataID);
  Except
    LCopy.Free;
    Raise;
  End;
End;
//________________________________________________________________________________________
Function TSourceCollectingDataService.UpdateSourceCollectingDataPartial(Const AID: Integer; Const ASourceData: TLead_SourceCollectingData): TLead_SourceCollectingData;
Var
  LExisting: TLead_SourceCollectingData;
Begin
  LExisting := TMVCActiveRecord.GetByPK<TLead_SourceCollectingData>(AID, False);
  If Not Assigned(LExisting) Then
  Begin
    Exit(nil);
  End;

  Try
    If (Not ASourceData.Code.IsEmpty) Then
      LExisting.Code := ASourceData.Code;

    If (Not ASourceData.Name.IsEmpty) Then
      LExisting.Name := ASourceData.Name;

    If (ASourceData.Link.HasValue) Then
      LExisting.Link := ASourceData.Link;

    If (ASourceData.IsActive.HasValue) Then
      LExisting.IsActive := ASourceData.IsActive;

    If (ASourceData.Description.HasValue) Then
      LExisting.Description := ASourceData.Description;

    LExisting.Update;
    Result := LExisting;
  Except
    LExisting.Free;
    Raise;
  End;
End;
//________________________________________________________________________________________
Function TSourceCollectingDataService.DeleteSourceCollectingData(Const AID: Integer): Boolean;
Var
  LExisting: TLead_SourceCollectingData;
Begin
  LExisting := TMVCActiveRecord.GetByPK<TLead_SourceCollectingData>(AID, False);
  If Not Assigned(LExisting) Then
  Begin
    Exit(False);
  End;

  Try
    LExisting.Delete;
    Result := True;
  Finally
    LExisting.Free;
  End;
End;
//________________________________________________________________________________________

End.
