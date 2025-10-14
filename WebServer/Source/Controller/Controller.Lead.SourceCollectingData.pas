Unit Controller.Lead.SourceCollectingData;

Interface

Uses
  System.SysUtils,
  System.Classes,
  System.Generics.Collections,
  MVCFramework,
  MVCFramework.Commons,
  MVCFramework.ActiveRecord,
  MVCFramework.Swagger.Commons,
  MVCFramework.Nullables,
  Service.Interfaces,
  Model.Lead.SourceCollectingData,
  WebModule.SalamtCRM;

Type
  [MVCPath(BASE_API_V1 + '/source-collecting-data')]
  TLeadSourceCollectingDataController = Class(TMVCController)
  Public

    [MVCPath('')]
    [MVCHTTPMethods([httpGET])]
    [MVCProduces(TMVCMediaType.APPLICATION_JSON)]
    [MVCConsumes(TMVCMediaType.APPLICATION_JSON)]
    Procedure GetAllSourceCollectingData(Const [MVCInject] ASourceDataService: ISourceCollectingDataService);

    [MVCPath('/($ASourceDataID)')]
    [MVCHTTPMethods([httpGET])]
    [MVCProduces(TMVCMediaType.APPLICATION_JSON)]
    [MVCConsumes(TMVCMediaType.APPLICATION_JSON)]
    Procedure GetSourceCollectingDataByID(Const ASourceDataID: String;
      Const [MVCInject] ASourceDataService: ISourceCollectingDataService);

    [MVCPath('')]
    [MVCHTTPMethods([httpPOST])]
    [MVCProduces(TMVCMediaType.APPLICATION_JSON)]
    [MVCConsumes(TMVCMediaType.APPLICATION_JSON)]
    Procedure CreateSourceCollectingData(Const [MVCInject] ASourceDataService: ISourceCollectingDataService);

    [MVCPath('/($ASourceDataID)')]
    [MVCHTTPMethods([httpPUT])]
    [MVCProduces(TMVCMediaType.APPLICATION_JSON)]
    [MVCConsumes(TMVCMediaType.APPLICATION_JSON)]
    Procedure UpdateSourceCollectingData(Const ASourceDataID: String;
      Const [MVCInject] ASourceDataService: ISourceCollectingDataService);

    [MVCPath('/($ASourceDataID)')]
    [MVCHTTPMethods([httpDELETE])]
    [MVCProduces(TMVCMediaType.APPLICATION_JSON)]
    [MVCConsumes(TMVCMediaType.APPLICATION_JSON)]
    Procedure DeleteSourceCollectingData(Const ASourceDataID: String;
      Const [MVCInject] ASourceDataService: ISourceCollectingDataService);
  End;

Implementation

Uses
  MVCFramework.Serializer.Commons,
  System.JSON, FireDAC.Stan.Error;

{ TLeadSourceCollectingDataController }

//________________________________________________________________________________________
Procedure TLeadSourceCollectingDataController.GetAllSourceCollectingData(Const ASourceDataService: ISourceCollectingDataService);
Var
  LSourceDataList: TObjectList<TLead_SourceCollectingData>;
  LEqualIndex: Integer;
  LPageArrayData: TArray<string>;
  LCurrPage, LPageData, Key, Value, LStatus, LContext: String;
  LMetaJSON, LPageJSON: TJSONObject;
Begin
  LMetaJSON := TJSONObject.Create;
  Try
    Try
      LCurrPage := Context.Request.Params['page'];
      LStatus := Context.Request.Params['status'];
      LContext := Context.Request.Params['context'];
      LSourceDataList := ASourceDataService.GetAllSourceCollectingData(LCurrPage, LStatus, LContext);
      If Assigned(LSourceDataList) then
      Begin
        LPageJSON := TJSONObject.Create;
        Try
          LPageArrayData := GetPaginationData(lCurrPage.ToInteger,
                                               LSourceDataList.Count,
                                               PAGE_SIZE,
                                               BASE_API_V1 + '/source-collecting-data?page=($page)')
                                               .ToString.Split([';']);
          For LPageData in LPageArrayData do
          Begin
            LEqualIndex := LPageData.IndexOf('=');
            If (LEqualIndex > 0) then
            Begin
              Key := LPageData.Substring(0, LEqualIndex).Trim;
              Value := LPageData.Substring(LEqualIndex + 1).Trim;
              LPageJSON.AddPair(Key, Value);
            End;
          End;

          LMetaJSON.AddPair('page', LPageJSON);
          LMetaJSON.AddPair('data_type', 'list<model_lead_sourcecollectingdata>');
          LMetaJSON.AddPair('count', LSourceDataList.Count);
          LMetaJSON.AddPair('is_success', True);
          LMetaJSON.AddPair('description', 'لیست تمام منابع جمع‌آوری سرنخ');

          Render(HTTP_STATUS.OK,
            ObjectDict(False)
              .Add('meta', StrToJSONObject(LMetaJSON.ToString))
              .Add('data', LSourceDataList)
          );
        Finally
          LSourceDataList.Free;
        End;
      End
      Else
      Begin
        Raise Exception.Create('هنگام خواندن منابع جمع‌آوری سرنخ خطایی رخ داده است!');
      End;
    Except
      On E: Exception do
      Begin
        LMetaJSON.AddPair('data_type', 'list<model_lead_sourcecollectingdata>');
        LMetaJSON.AddPair('count', 0);
        LMetaJSON.AddPair('is_success', False);
        LMetaJSON.AddPair('description', E.Message);

        Render(HTTP_STATUS.InternalServerError,
          ObjectDict(True)
            .Add('meta', StrToJSONObject(LMetaJSON.ToString))
            .Add('data', TList.Create)
        );
      End;
    End;
  Finally
    LMetaJSON.Free;
  End;
End;
//________________________________________________________________________________________
Procedure TLeadSourceCollectingDataController.GetSourceCollectingDataByID(Const ASourceDataID: String;
  Const ASourceDataService: ISourceCollectingDataService);
Var
  LStatusCode, LSourceDataID: Integer;
  LSourceData: TLead_SourceCollectingData;
  LMetaJSON: TJSONObject;
Begin
  LMetaJSON := TJSONObject.Create;
  Try
    LStatusCode := HTTP_STATUS.InternalServerError;
    Try
      If (ASourceDataID.IsEmpty) OR (Not TryStrToInt(ASourceDataID, LSourceDataID)) Then
      Begin
        LStatusCode := HTTP_STATUS.NotFound;
        Raise EMVCException.Create('شناسه منبع نامعتبر است!');
      End;

      LSourceData := ASourceDataService.GetSourceCollectingDataByID(LSourceDataID);
      If Assigned(LSourceData) Then
      Begin
        Try
          LStatusCode := HTTP_STATUS.OK;

          LMetaJSON.AddPair('data_type', 'model_lead_sourcecollectingdata');
          LMetaJSON.AddPair('count', 1);
          LMetaJSON.AddPair('is_success', True);
          LMetaJSON.AddPair('description', Format('منبع به کد %s یافت شد.', [LSourceData.Code]));

          Render(LStatusCode,
            ObjectDict(False)
              .Add('meta', StrToJSONObject(LMetaJSON.ToString))
              .Add('data', LSourceData)
          );
        Finally
          LSourceData.Free;
        End;
      End
      Else
      Begin
        LStatusCode := HTTP_STATUS.NotFound;
        Raise EMVCException.Create('منبع یافت نشد');
      End;
    Except
      On E: Exception do
      Begin
        LMetaJSON.AddPair('data_type', 'model_lead_sourcecollectingdata');
        LMetaJSON.AddPair('count', 0);
        LMetaJSON.AddPair('is_success', False);
        LMetaJSON.AddPair('description', E.Message);

        Render(LStatusCode,
          ObjectDict(True)
            .Add('meta', StrToJSONObject(LMetaJSON.ToString))
            .Add('data', TMVCObjectDictionary.Create())
        );
      End;
    End;
  Finally
    LMetaJSON.Free;
  End;
End;
//________________________________________________________________________________________
Procedure TLeadSourceCollectingDataController.CreateSourceCollectingData(Const ASourceDataService: ISourceCollectingDataService);
Var
  LSourceDataInput: TLead_SourceCollectingData;
  LCreated: TLead_SourceCollectingData;
  LMetaJSON: TJSONObject;
  LStatusCode: Integer;
Begin
  LMetaJSON := TJSONObject.Create;
  Try
    LStatusCode := HTTP_STATUS.InternalServerError;
    Try
      LSourceDataInput := Context.Request.BodyAs<TLead_SourceCollectingData>;
      If Not Assigned(LSourceDataInput) Then
      Begin
        LStatusCode := HTTP_STATUS.BadRequest;
        Raise EMVCException.Create('داده ورودی نامعتبر است');
      End;

      Try
        LCreated := Nil;
        Try
          LCreated := ASourceDataService.CreateSourceCollectingData(LSourceDataInput);
        Except
          On E: EFDException do
          Begin
            If Assigned(LCreated) then
              LCreated.Free;

            If Pos('duplicate', E.Message.ToLower) > 0 then
            Begin
              LStatusCode := HTTP_STATUS.Conflict;
              Raise EMVCException.Create('کد منبع تکراری است')
            End
            Else
            Begin
              Raise EMVCException.Create('خطای پایگاه داده: ' + E.Message);
            End;
          End;

          On E: Exception do
          Begin
            Raise EMVCException.Create(E.Message);
          End;
        End;
        Try
          LStatusCode := HTTP_STATUS.Created;

          LMetaJSON.AddPair('data_type', 'model_lead_sourcecollectingdata');
          LMetaJSON.AddPair('count', 1);
          LMetaJSON.AddPair('is_success', True);
          LMetaJSON.AddPair('url', BASE_API_V1 + '/source-collecting-data/' + LCreated.SourceCollectingDataID.ToString);
          LMetaJSON.AddPair('description', 'منبع با موفقیت ذخیره شد.');

          Render(LStatusCode,
            ObjectDict(False)
              .Add('meta', StrToJSONObject(LMetaJSON.ToString))
              .Add('data', LCreated)
          );
        Finally
          LCreated.Free;
        End;
      Finally
        LSourceDataInput.Free;
      End;
    Except
      On E: Exception do
      Begin
        LMetaJSON.AddPair('data_type', 'model_lead_sourcecollectingdata');
        LMetaJSON.AddPair('count', 0);
        LMetaJSON.AddPair('is_success', False);
        LMetaJSON.AddPair('description', E.Message);

        Render(LStatusCode,
          ObjectDict(True)
            .Add('meta', StrToJSONObject(LMetaJSON.ToString))
            .Add('data', TMVCObjectDictionary.Create())
        );
      End;
    End;
  Finally
    LMetaJSON.Free;
  End;
End;
//________________________________________________________________________________________
Procedure TLeadSourceCollectingDataController.UpdateSourceCollectingData(Const ASourceDataID: String;
  Const ASourceDataService: ISourceCollectingDataService);
Var
  LSourceDataID: Integer;
  LSourceDataInput: TLead_SourceCollectingData;
  LUpdated: TLead_SourceCollectingData;
  LMetaJSON: TJSONObject;
  LStatusCode: Integer;
Begin
  LMetaJSON := TJSONObject.Create;
  Try
    LStatusCode := HTTP_STATUS.InternalServerError;
    Try
      If (ASourceDataID.IsEmpty) OR (Not TryStrToInt(ASourceDataID, LSourceDataID)) Then
      Begin
        LStatusCode := HTTP_STATUS.NotFound;
        Raise EMVCException.Create('شناسه منبع نامعتبر است!');
      End;

      LSourceDataInput := Context.Request.BodyAs<TLead_SourceCollectingData>;
      If Not Assigned(LSourceDataInput) Then
      Begin
        LStatusCode := HTTP_STATUS.BadRequest;
        Raise EMVCException.Create('داده ورودی نامعتبر است');
      End;

      Try
        Try
          LUpdated := ASourceDataService.UpdateSourceCollectingDataPartial(LSourceDataID, LSourceDataInput);
        Except
          On E: EFDException do
          Begin
            If Pos('duplicate', E.Message.ToLower) > 0 then
            Begin
              LStatusCode := HTTP_STATUS.Conflict;
              Raise EMVCException.Create('کد منبع تکراری است')
            End
            Else
            Begin
              Raise EMVCException.Create('خطای پایگاه داده: ' + E.Message);
            End;
          End;

          On E: Exception do
          Begin
            Raise EMVCException.Create(E.Message);
          End;
        End;

        If Not Assigned(LUpdated) Then
        Begin
          LStatusCode := HTTP_STATUS.NotFound;
          Raise EMVCException.Create('منبع یافت نشد');
        End;

        Try
          LStatusCode := HTTP_STATUS.OK;

          LMetaJSON.AddPair('data_type', 'model_lead_sourcecollectingdata');
          LMetaJSON.AddPair('count', 1);
          LMetaJSON.AddPair('is_success', True);
          LMetaJSON.AddPair('description', 'منبع با موفقیت بروزرسانی شد.');

          Render(LStatusCode,
            ObjectDict(False)
              .Add('meta', StrToJSONObject(LMetaJSON.ToString))
              .Add('data', LUpdated)
          );
        Finally
          LUpdated.Free;
        End;
      Finally
        LSourceDataInput.Free;
      End;
    Except
      On E: Exception do
      Begin
        LMetaJSON.AddPair('data_type', 'model_lead_sourcecollectingdata');
        LMetaJSON.AddPair('count', 0);
        LMetaJSON.AddPair('is_success', False);
        LMetaJSON.AddPair('description', E.Message);

        Render(LStatusCode,
          ObjectDict(True)
            .Add('meta', StrToJSONObject(LMetaJSON.ToString))
            .Add('data', TMVCObjectDictionary.Create())
        );
      End;
    End;
  Finally
    LMetaJSON.Free;
  End;
End;
//________________________________________________________________________________________
Procedure TLeadSourceCollectingDataController.DeleteSourceCollectingData(Const ASourceDataID: String;
  Const ASourceDataService: ISourceCollectingDataService);
Var
  LStatusCode, LSourceDataID: Integer;
  LMetaJSON: TJSONObject;
Begin
  LMetaJSON := TJSONObject.Create;
  Try
    LStatusCode := HTTP_STATUS.InternalServerError;
    Try
      If (ASourceDataID.IsEmpty) OR (Not TryStrToInt(ASourceDataID, LSourceDataID)) Then
      Begin
        LStatusCode := HTTP_STATUS.NotFound;
        Raise EMVCException.Create('شناسه منبع نامعتبر است!');
      End;

      If ASourceDataService.DeleteSourceCollectingData(LSourceDataID) Then
      Begin
        LStatusCode := HTTP_STATUS.OK;

        LMetaJSON.AddPair('data_type', 'integer');
        LMetaJSON.AddPair('count', 1);
        LMetaJSON.AddPair('is_success', True);
        LMetaJSON.AddPair('description', 'منبع با موفقیت حذف شد.');

        Render(LStatusCode,
          ObjectDict(True)
            .Add('meta', StrToJSONObject(LMetaJSON.ToString))
            .Add('data', StrToJSONObject(TJSONObject.Create(TJSONPair.Create('sourcecollectingdataid', LSourceDataID)).ToString))
        );
      End
      Else
      Begin
        LStatusCode := HTTP_STATUS.NotFound;
        Raise EMVCException.Create('منبع مورد نظر یافت نشد!');
      End;
    Except
      On E: Exception do
      Begin
        LMetaJSON.AddPair('data_type', 'integer');
        LMetaJSON.AddPair('count', 0);
        LMetaJSON.AddPair('is_success', False);
        LMetaJSON.AddPair('description', E.Message);

        Render(LStatusCode,
          ObjectDict(True)
            .Add('meta', StrToJSONObject(LMetaJSON.ToString))
            .Add('data', TMVCObjectDictionary.Create())
        );
      End;
    End;
  Finally
    LMetaJSON.Free;
  End;
End;

End.
