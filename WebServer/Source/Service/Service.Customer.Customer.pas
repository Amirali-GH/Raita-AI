Unit Service.Customer.Customer;

Interface

Uses
    System.SysUtils,
    System.Generics.Collections,
    MVCFramework.ActiveRecord,
    MVCFramework.Nullables,
    Model.Customer.Customer,
    Model.View.Leads,
    Service.Interfaces;

Type
    TCustomerService = Class(TInterfacedObject, ICustomerService)
    Public
        Function GetAllCustomers(Var APage: String; Const AStatus: String;
          Const AContext: String; Const ABranchID: String; Out ATotalSize: Integer): TObjectList<TCustomer_Leads>;
        Function GetCustomerByID(Const AID: Int64): TCustomer_Customer;
        Function CreateCustomer(Const ACustomer: TCustomer_Customer): TCustomer_Customer;
        Function UpdateCustomerPartial(Const AID: Int64; Const ACustomer: TCustomer_Customer): TCustomer_Customer;
        Function DeleteCustomer(Const AID: Int64): Boolean;
    End;

Implementation

Uses Utils, Math, StrUtils, WebModule.SalamtCRM;

{ TCustomerService }

//________________________________________________________________________________________
FUNCTION TCustomerService.GetAllCustomers(
    VAR APage: String;
    CONST AStatus: String;
    CONST AContext: String;
    Const ABranchID: String;
    OUT ATotalSize: Integer): TObjectList<TCustomer_Leads>;
VAR
    LCurrPage: Integer;
    LFirstRec: Integer;
    LHasActive: Boolean;
    LRQL: String;
    LStatusActive: Integer;
    LBranchID: Integer;
Begin
    LRQL := '';
    ATotalSize := 0;
    LCurrPage := 0;
    TryStrToInt(APage, LCurrPage);
    LCurrPage := Max(LCurrPage, 1);
    LFirstRec := (LCurrPage - 1) * PAGE_SIZE;
    APage := LCurrPage.ToString;

    LBranchID := StrToIntDef(ABranchID, 0);

    // حالت فعال/غیرفعال
    LHasActive := False;
    LStatusActive := -1; // -1 = no filter, 0 = inactive, 1 = active
    IF (AStatus.ToLower.Contains('inactive')) THEN
    Begin
      LStatusActive := 0;
      LHasActive := True;
    End
    Else If (AStatus.ToLower.Contains('active')) Then
    Begin
      LStatusActive := 1;
      LHasActive := True;
    End;

    // ساخت RQL بر اساس فیلتر وضعیت
    IF (LHasActive) THEN
    Begin
      LRQL := Format('eq(IsActive,%d)', [LStatusActive]);
    End;

    // فیلتر متن جستجو (FullName یا Phone)
    IF (NOT AContext.IsEmpty) THEN
    Begin
        IF (LRQL.IsEmpty) THEN
        Begin
          LRQL := Format('or(contains(FullName,"%s"),contains(Phone,"%s"))',
            [AContext, AContext]);
        End
        Else
        Begin
          LRQL := Format('and(%s,or(contains(FullName,%s),contains(Phone,%s)))',
            [LRQL, QuotedStr(AContext), QuotedStr(AContext)]);
        End;
    End;

    IF (LBranchID <> 0) THEN
    Begin
        IF (LRQL.IsEmpty) THEN
        Begin
            LRQL := Format('eq(branchid,%d)', [LBranchID]);
        End
        Else
        Begin
            LRQL := Format('and(eq(branchid,%d),%s)',[LBranchID, LRQL]);
        End;
    End;

    // شمارش کل با همان RQL
    ATotalSize := TMVCActiveRecord.Count<TCustomer_Leads>(LRQL);

    // مرتب‌سازی و محدودیت صفحه
    IF (LRQL.IsEmpty) then
    Begin
      LRQL := 'sort(+FullName,+Phone)';
    End
    Else
    Begin
      LRQL := LRQL + ';sort(+FullName,+Phone)';
    End;

    LRQL := LRQL + Format(';limit(%d,%d)', [LFirstRec, PAGE_SIZE]);

    // انتخاب با RQL
    Result := TMVCActiveRecord.SelectRQL<TCustomer_Leads>(LRQL, PAGE_SIZE);
End;
//________________________________________________________________________________________
Function TCustomerService.GetCustomerByID(Const AID: Int64): TCustomer_Customer;
Begin
    Result := TMVCActiveRecord.GetByPK<TCustomer_Customer>(AID, False);
End;
//________________________________________________________________________________________
Function TCustomerService.CreateCustomer(Const ACustomer: TCustomer_Customer): TCustomer_Customer;
Var
    LCopy: TCustomer_Customer;
Begin
    LCopy := TCustomer_Customer.Create;
    Try
        LCopy.FirstName := ACustomer.FirstName;
        LCopy.LastName := ACustomer.LastName;
        LCopy.Phone := ACustomer.Phone;
        LCopy.NationalID := ACustomer.NationalID;
        LCopy.Email := ACustomer.Email;
        LCopy.Address := ACustomer.Address;
        LCopy.Budget := ACustomer.Budget;
        LCopy.CampaignID := ACustomer.CampaignID;
        LCopy.CreatedByUserID := ACustomer.CreatedByUserID;
        LCopy.IsActive := ACustomer.IsActive;
        LCopy.Description := ACustomer.Description;

        If (ACustomer.IsActive.HasValue) then
        Begin
            LCopy.IsActive := ACustomer.IsActive;
        End
        Else
        Begin
            LCopy.IsActive := True;
        End;

        LCopy.Insert;
        Result := GetCustomerByID(LCopy.CustomerID);
    Except
        LCopy.Free;
        Raise;
    End;
End;
//________________________________________________________________________________________
Function TCustomerService.UpdateCustomerPartial(Const AID: Int64; Const ACustomer: TCustomer_Customer): TCustomer_Customer;
Var
    LExisting: TCustomer_Customer;
Begin
    LExisting := TMVCActiveRecord.GetByPK<TCustomer_Customer>(AID, False);
    If Not Assigned(LExisting) Then
    Begin
        Exit(nil);
    End;

    Try
        If (ACustomer.FirstName.HasValue) Then
        Begin
            LExisting.FirstName := ACustomer.FirstName;
        End;

        If (ACustomer.LastName.HasValue) Then
        Begin
            LExisting.LastName := ACustomer.LastName;
        End;

        If (ACustomer.Phone.HasValue) Then
        Begin
            LExisting.Phone := ACustomer.Phone;
        End;

        If (ACustomer.NationalID.HasValue) Then
        Begin
            LExisting.NationalID := ACustomer.NationalID;
        End;

        If (ACustomer.Email.HasValue) Then
        Begin
            LExisting.Email := ACustomer.Email;
        End;

        If (ACustomer.Address.HasValue) Then
        Begin
            LExisting.Address := ACustomer.Address;
        End;

        If (ACustomer.Budget.HasValue) Then
        Begin
            LExisting.Budget := ACustomer.Budget;
        End;

        If (ACustomer.CampaignID.HasValue) Then
        Begin
            LExisting.CampaignID := ACustomer.CampaignID;
        End;

        If (ACustomer.CreatedByUserID.HasValue) Then
        Begin
            LExisting.CreatedByUserID := ACustomer.CreatedByUserID;
        End;

        If (ACustomer.IsActive.HasValue) Then
        Begin
            LExisting.IsActive := ACustomer.IsActive;
        End;

        If (ACustomer.Description.HasValue) Then
        Begin
            LExisting.Description := ACustomer.Description;
        End;

        LExisting.Update;
        Result := LExisting;
    Except
        LExisting.Free;
        Raise;
    End;
End;
//________________________________________________________________________________________
Function TCustomerService.DeleteCustomer(Const AID: Int64): Boolean;
Var
    LExisting: TCustomer_Customer;
Begin
    LExisting := TMVCActiveRecord.GetByPK<TCustomer_Customer>(AID, False);
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
