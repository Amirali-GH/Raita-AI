Unit Model.View.Leads;

Interface

Uses
    MVCFramework.ActiveRecord,
    MVCFramework.Nullables,
    MVCFramework.Serializer.Commons,
    System.Generics.Collections;

Type
    [MVCNameCase(ncLowerCase)]
    [MVCTable('vw_list_of_the_leads')]
    [MVCEntityActions([eaRetrieve])]
    TCustomer_Leads = class(TMVCActiveRecord)
    Private
        [MVCTableField('CustomerID')]
        FCustomerID: NullableInt64;

        [MVCTableField('Phone')]
        FPhone: NullableString;

        [MVCTableField('FullName')]
        FFullName: NullableString;

        [MVCTableField('NationalID')]
        FNationalID: NullableString;

        [MVCTableField('RequestedCarName')]
        FRequestedCarName: NullableString;

        [MVCTableField('BranchName')]
        FBranchName: NullableString;

        [MVCTableField('BranchID')]
        FBranchID: NullableInt64;

        [MVCTableField('SaleAgentName')]
        FSaleAgentName: NullableString;

        [MVCTableField('LastContactDate_Shams')]
        FLastContactDate_Shams: NullableString;

        [MVCTableField('CustomerStatus')]
        FCustomerStatus: NullableString;

        [MVCTableField('CustomerStatusID')]
        FCustomerStatusID: NullableInt64;

        [MVCTableField('Notes1')]
        FNotes1: NullableString;

        [MVCTableField('Notes2')]
        FNotes2: NullableString;

        [MVCTableField('Notes3')]
        FNotes3: NullableString;

        [MVCTableField('PotentialCode')]
        FPotentialCode: NullableString;

        [MVCTableField('Potential')]
        FPotential: NullableString;

        [MVCTableField('CampaignCode')]
        FCampaignCode: NullableString;

        [MVCTableField('Campaign')]
        FCampaign: NullableString;

    Public
        Property CustomerID: NullableInt64 read FCustomerID write FCustomerID;
        Property Phone: NullableString read FPhone write FPhone;
        Property FullName: NullableString read FFullName write FFullName;
        Property NationalID: NullableString read FNationalID write FNationalID;
        Property RequestedCarName: NullableString read FRequestedCarName write FRequestedCarName;
        Property BranchName: NullableString read FBranchName write FBranchName;
        Property BranchID: NullableInt64 read FBranchID write FBranchID;
        Property SaleAgentName: NullableString read FSaleAgentName write FSaleAgentName;
        Property LastContactDate_Shams: NullableString read FLastContactDate_Shams write FLastContactDate_Shams;
        Property CustomerStatus: NullableString read FCustomerStatus write FCustomerStatus;
        Property CustomerStatusID: NullableInt64 read FCustomerStatusID write FCustomerStatusID;
        Property Notes1: NullableString read FNotes1 write FNotes1;
        Property Notes2: NullableString read FNotes2 write FNotes2;
        Property Notes3: NullableString read FNotes3 write FNotes3;
        Property PotentialCode: NullableString read FPotentialCode write FPotentialCode;
        Property Potential: NullableString read FPotential write FPotential;
        Property CampaignCode: NullableString read FCampaignCode write FCampaignCode;
        Property Campaign: NullableString read FCampaign write FCampaign;
    End;

Implementation

End.

