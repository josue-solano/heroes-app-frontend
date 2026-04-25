-- =============================================
-- Author:		Nikita Yenumula
-- Create date: 8/05/2015
-- Description:	Returns statement config ID 
-- =============================================

--CREATE FUNCTION [dbo].[udf_getInvStatementConfigId_v140](
DECLARE @receiverEntityDetailId int = 211
													, @senderEntityDetailId int = 201 --253--253--234
													, @transactionDate date = '2026-04-1' --'2026-03-16'--'2026-03-19'--'2026-03-23'
													, @invoiceTypeId int = 86
--)
--RETURNS int
--AS
BEGIN
	Declare @activeStatusId int
	Declare @allInvoiceTypeId int
	Declare @invStatementConfigId int =null
	Declare @tmpReceiverEntities table (
		receiverEntityId int,
		lvl int,
		groupId INT DEFAULT -1 )
	Declare @tmpSenderEntities table (senderEntityId int,
		lvl int,
		groupId INT DEFAULT -1 )

	SELECT @activeStatusId = CASE WHEN parentLookUpCode = 121 THEN lookUpId ELSE @activeStatusId END
			, @allInvoiceTypeId = CASE WHEN parentLookUpCode = 21 THEN lookUpId ELSE @allInvoiceTypeId END
	FROM lookUp_tb WITH (NOLOCK)
	WHERE parentLookUpCode IN (121,21) AND lookUpCode = 1

	insert into @tmpReceiverEntities
		(receiverEntityId, lvl)
			select @receiverEntityDetailId, 0
	union
		select parentEntityDetailId, lvl
		from [dbo].[Corc_UDF_GetParentEntityIds](@receiverEntityDetailId)

	SELECT 'Receiver and Parents', *
	FROM @tmpReceiverEntities

	insert into @tmpSenderEntities
		(senderEntityId, lvl)
			select @senderEntityDetailId, 0
	union
		select parentEntityDetailId, lvl
		from [dbo].[Corc_UDF_GetParentEntityIds](@senderEntityDetailId)
	Declare @tmpStatementConfigs table (statementConfigId int
	,
		receiverEntitydetailId int
	,
		ReclvlOrder int 
	,
		senderEntityDetailId int
	,
		SenderlvlOrder int 
	,
		invoiceType INT
	)

	select parentEntityDetailId, lvl
	from [dbo].[Corc_UDF_GetParentEntityIds](@senderEntityDetailId)

	SELECT 'Sender and Parents', *
	FROM @tmpSenderEntities

	INSERT INTO @tmpReceiverEntities
		(receiverEntityId,lvl,groupId)
	SELECT TR.receiverEntityId, TR.lvl, GAF.groupId
	FROM @tmpReceiverEntities TR
		INNER JOIN groupAssignment_tb GAF WITH (NOLOCK) ON GAF.entityDetailId = TR.receiverEntityId AND GAF.isActive = 1

	SELECT 'Receiver Groups', *
	FROM @tmpReceiverEntities

	INSERT INTO @tmpSenderEntities
		(senderEntityId,lvl,groupId)
	SELECT TS.senderEntityId, TS.lvl, GAD.groupId
	FROM @tmpSenderEntities TS
		INNER JOIN groupAssignment_tb GAD WITH (NOLOCK) ON GAD.entityDetailId = TS.senderEntityId AND GAD.isActive = 1

	SELECT 'Sender Groups', *
	FROM @tmpSenderEntities

	insert into @tmpStatementConfigs
		(statementConfigId, receiverEntitydetailId,ReclvlOrder, senderEntityDetailId , SenderlvlOrder, invoiceType)
	SELECT DISTINCT
		SC.statementConfigId --, startDate,endDate
	, TR.receiverEntityId
	, TR.lvl [ReclvlOrder] 
	, SS.senderEntityDetailId 
	, TS.lvl [SenderlvlOrder]  
	, CASE WHEN SI.invoiceTypeId   = @allInvoiceTypeId THEN 1 ELSE 0 END AS invoiceType
	FROM
		StatementConfig_tb SC WITH (NOLOCK)
		INNER JOIN @tmpReceiverEntities TR ON 
	CASE WHEN SC.receiverEntitydetailId = TR.receiverEntityId AND ISNULL(SC.fleetGroupNameID,0) = 0 THEN 1 
		WHEN ISNULL(SC.fleetGroupNameID,0) = ISNULL(TR.groupId,0) AND ISNULL(SC.fleetGroupNameID,0) <> 0 THEN 1 
	ELSE 0 END = 1
		INNER JOIN statementSenderRel_tb SS WITH (NOLOCK) on SC.statementConfigId = SS.statementConfigId
		INNER JOIN @tmpSenderEntities TS ON 
	CASE WHEN SS.senderEntityDetailId = TS.senderEntityId AND ISNULL(SC.dealerGroupNameID,0) = 0 THEN 1 
		WHEN ISNULL(SC.dealerGroupNameID,0) = ISNULL(TS.groupId,0) AND ISNULL(SC.dealerGroupNameID,0) <> 0 THEN 1 
	ELSE 0 END = 1
		INNER JOIN statementInvType_tb SI WITH (NOLOCK) on SC.statementConfigId = SI.statementConfigId
	WHERE SC.statusId = @activeStatusId
		AND (SC.startDate is NULL or SC.startDate <= @transactionDate ) AND (SC.endDate >= @transactionDate OR SC.endDate is null)
		AND (@invoiceTypeId IS NULL OR SI.invoiceTypeId = @invoiceTypeId or SI.invoiceTypeId = @allInvoiceTypeId)

	select top 1
		@invStatementConfigId = TSC.statementConfigId
	-- , TSC.receiverEntitydetailId, TSC.senderEntityDetailId , 
	from @tmpStatementConfigs TSC
	WHERE SenderlvlOrder IS NOT NULL AND ReclvlOrder IS NOT NULL
	ORDER BY TSC.ReclvlOrder 
	, TSC.SenderlvlOrder 
	, invoiceType

	select 'Statement Configurations', *
	-- , TSC.receiverEntitydetailId, TSC.senderEntityDetailId , 
	from @tmpStatementConfigs TSC
	WHERE SenderlvlOrder IS NOT NULL AND ReclvlOrder IS NOT NULL
	ORDER BY TSC.ReclvlOrder 
	, TSC.SenderlvlOrder 
	, invoiceType

	SELECT @invStatementConfigId '@invStatementConfigId'
End
